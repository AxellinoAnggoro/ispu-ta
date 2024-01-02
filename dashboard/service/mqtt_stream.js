import moment from 'moment-timezone';
import db from '../query/db.js';

const pollutant_ranges = {
    'PM10': [
        [0, 50, 0, 50],
        [51, 100, 51, 150],
        [101, 200, 151, 350],
        [201, 300, 351, 420],
        [301, 500, 421, 500]
    ],
    'PM2.5': [
        [0, 50, 0, 15.5],
        [51, 100, 15.6, 55.4],
        [101, 200, 55.5, 150.4],
        [201, 300, 150.5, 250.4],
        [301, 500, 250.5, 500.0]
    ],
    'CO': [
        [0, 50, 0, 4000],
        [51, 100, 4001, 8000],
        [101, 200, 8001, 15000],
        [201, 300, 15001, 30000],
        [301, 500, 30001, 45000]
    ],
    'O3': [
        [0, 50, 0, 120],
        [51, 100, 121, 235],
        [101, 200, 236, 400],
        [201, 300, 401, 800],
        [301, 500, 801, 1000]
    ],
    'NO2': [
        [0, 50, 0, 80],
        [51, 100, 81, 200],
        [101, 200, 201, 1130],
        [201, 300, 1131, 2260],
        [301, 500, 2261, 3000]
    ]
};

function calculateISPU(concentration, pollutant) {
    const ranges = pollutant_ranges[pollutant.toUpperCase()] || [];
    let ispu = null;

    for (let range of ranges) {
        const [Ib, Ia, Xb, Xa] = range;
        if (Xb <= concentration && concentration <= Xa) {
            ispu = Ib + ((Ia - Ib) * (concentration - Xb) / (Xa - Xb));
            break;
        }
    }

    if (ispu === null && concentration > ranges[ranges.length - 1][3]) {
        ispu = 999; // Indikasi bahwa ISPU di atas rentang yang dapat diukur
    }

    return ispu;
}


export function mqtt_pipeline(io, mqttclient) {
    mqttclient.on('message', (topic, message) => {
        console.log(`Received message from topic ${topic}`);

        try {
            const sensorData = JSON.parse(message.toString());
            sensorData.timestamp = moment().tz("Asia/Jakarta").format('YYYY-MM-DDTHH:mm:ss');

            db.get_avg_pm().then(pm => {
                // const avgPm25 = pm.avg_pm25;
                // const avgPm10 = pm.avg_pm10;
                console.log(sensorData.pm25)
                const ispuResults = {
                    'PM10': calculateISPU(sensorData.pm10, 'PM10'),
                    'PM2.5': calculateISPU(sensorData.pm25, 'PM2.5'),
                    'CO': calculateISPU(sensorData.co, 'CO'),
                    'O3': calculateISPU(sensorData.ozone, 'O3'),
                    'NO2': calculateISPU(sensorData.no2, 'NO2')
                };

                const aqi = Object.values(ispuResults).reduce((max, val) => {
                    return (val !== 'NaN' && val > max) ? val : max;
                }, null);

                const values = [
                    sensorData.timestamp || null,
                    sensorData.temperature || null,
                    sensorData.humidity || null,
                    sensorData.pressure || null,
                    sensorData.co || null,
                    sensorData.pm25 || null,
                    sensorData.no2 || null,
                    sensorData.pm1 || null,
                    sensorData.ozone || null,
                    sensorData.pm10 || null,
                    Math.floor(aqi) || null
                ];

                sensorData.aqi = Math.floor(aqi);

                insertSensorData(values);

                io.emit('airQualityUpdate', JSON.stringify(sensorData));
            }).catch(err => {
                console.error('Error getting PM averages:', err);
            });

        } catch (e) {
            console.error('Invalid JSON received', e);
        }
    });
}

async function insertSensorData(values) {
    try {
        const result = await db.insert_data(values);
        console.log('Insert successful:', result);
    } catch (err) {
        console.error('Error during data insertion:', err);
    }
}