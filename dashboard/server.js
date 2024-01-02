import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import router from './routes/routes.js';
import { createServer } from 'http';
import { mqtt_pipeline } from './service/mqtt_stream.js';
import setupWs from './config/ws.js';
import mqttclient from './config/mqtt.js';


const app = express();
const server = createServer(app);
const io = setupWs(server);
mqtt_pipeline(io, mqttclient);


const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs')
app.use("/public", express.static('public'))

app.use('/', router)

//listen to port
server.listen(PORT, () => {
    console.log(`server is listening on ${PORT},
    http://localhost:${PORT}`)
})