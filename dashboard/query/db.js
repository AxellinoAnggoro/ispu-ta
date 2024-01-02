import { response } from 'express';
import { pool } from '../config/database.js';
import moment from 'moment-timezone';


let db = {};

db.insert_data = (values) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO gas_polutan (timestamp, temp, hum, pre, co, pm2_5, no2, pm1, o3, pm10, aqi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, (err, results) => {
            if (err) {
                console.error('Error inserting data into MySQL', err);
                reject(err);
            } else {
                console.log(`Data inserted into MySQL. Insert ID: ${results.insertId}`);
                resolve(results);
            }
        });
    });
}

db.get_initial_data = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM gas_polutan ORDER BY timestamp DESC LIMIT 1', (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL', err);
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
}

db.get_history_data = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM gas_polutan WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND timestamp < CURDATE()', (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

db.get_avg_pm = () => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
            AVG(pm2_5) AS avg_pm25,
            AVG(pm10) AS avg_pm10
        FROM gas_polutan
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR);`, (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL', err);
                reject(err);
            } else {
                console.log(results)
                resolve(results[0]);
            }
        });
    });
}

db.get_forecasting = () => {
    return new Promise((resolve, reject) => {
        // Get the current hour and the next hour
        const startOfHour = moment().tz('Asia/Jakarta').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
        const endOfHour = moment().tz('Asia/Jakarta').startOf('hour').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

        console.log(startOfHour)
        console.log(endOfHour)

        pool.query(`SELECT * FROM hasil_prediksi
                    WHERE forecast_datetime >= ?
                    AND forecast_datetime < ?;`,
            [startOfHour, endOfHour],
            (err, results) => {
                if (err) {
                    console.error('Error fetching data from MySQL', err);
                    reject(err);
                } else {
                    console.log(results);
                    resolve(results);
                }
            });
    });
};


export default db;