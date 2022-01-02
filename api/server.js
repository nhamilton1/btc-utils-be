const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require("path");


const normalDistRouter = require('../api/normalDist/normalDistRouter')
const server = express()

server.use(express.static(path.resolve(__dirname, "./client/build")));
server.use(express.json())
server.use(helmet())
server.use(cors())

server.use('/', normalDistRouter)

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server
