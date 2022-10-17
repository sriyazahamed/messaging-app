require('dotenv').config({ path: './.env' });

const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const express = require('express');
const cors = require('cors');
const database = require('./database/connect');
const service = require('./services');

const app = express();
const server = http.createServer(app);

// socket initialization
const io = socketio(server, { cors: { origin: '*' ,methods: ["GET","POST"]} });
// create connection to mongodb
database();


app.use(cors());
// express body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

io.on('connection', (socket) => service(io, socket));

app.use('/api', require('./routes'));

app.use(express.static('client/public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

module.exports = server;
