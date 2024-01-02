import { Server } from 'socket.io';

function setupWs(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        const userAgent = socket.handshake.headers['user-agent'];
        const ip = socket.handshake.address;
        console.log(`User connected: ${userAgent} ${ip}`);
    });

    return io;
}

export default setupWs;
