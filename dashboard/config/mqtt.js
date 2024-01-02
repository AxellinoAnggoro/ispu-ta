import mqtt from 'mqtt';

const mqttclient = mqtt.connect('mqtt://132.145.112.175:1883', {
    username: 'axel',
    password: 'axel123'
});

mqttclient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttclient.subscribe('emqx/esp32/allsensor', err => {
        if (!err) {
            console.log('Subscribed to "emqx/esp32/" topic');
        } else {
            console.error('Error subscribing to topic', err);
        }
    });
});


export default mqttclient;