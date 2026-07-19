const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection! Shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated.');
    });
});