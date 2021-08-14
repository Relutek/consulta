const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const path = require('path');

app.use('/client', express.static(path.join(__dirname, 'client')))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

var clients = {};
var timeNow = Date.now();

function updateTick() {
    let newTime = Date.now();
    console.log(newTime - timeNow);
    timeNow = newTime;
    for (b in clients) {
        var client = clients[b];
        io.emit('updatepos', {
            x: client.latestX,
            y: client.latestY
        });
    }

}

setInterval(updateTick, 20);

io.on('connection', (socket) => {
    console.log('Client id=[' + socket.id + '] connected');
    clients[socket.id] = {
        clientID: socket.id,
        latestX: 0,
        latestY: 0
    };
    socket.on('disconnect', function () {
        console.log('Client id=[' + socket.id + '] disconnected');
        delete clients[socket.id];
    });
    socket.on('xy', function (msg) {
        clients[socket.id].latestX = msg.x;
        clients[socket.id].latestY = msg.y;
    });
});