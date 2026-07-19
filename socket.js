const socketIo = require('socket.io');
const rideController = require('./controllers/ride.controller');
let io;

function initializeSocket(server) {
    io = socketIo(server);

    io.on('connection', (socket) => {

        socket.on('fetchRides', async (payload) => {
            try {
                const filters = payload?.filters || {};
                const rides = await rideController.getAvailableRides(filters);
                socket.emit('rides', rides);
            } catch (err) {
                console.error('Socket fetchRides error:', err);
            }
        });

        socket.on('fetchRidebyId', async (payload) => {
            try {
                const id = payload?.id;
                if (!id) return socket.emit('sendRideOfId', null);

                const details = await rideController.getRidebyId(id);
                socket.emit('sendRideOfId', details || null);
            } catch (err) {
                console.error('Socket fetchRidebyId error:', err);
                socket.emit('sendRideOfId', null);
            }
        });

        socket.on('disconnect', () => {
        });
    });
}

const getIoInstance = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// const sendMessageToSocketId = (socketId, messageObject) => {

// console.log(messageObject);

//     if (io) {
//         io.to(socketId).emit(messageObject.event, messageObject.data);
//     } else {
//         console.log('Socket.io not initialized.');
//     }
// }

module.exports = { initializeSocket, getIoInstance };