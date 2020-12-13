const io = require("socket.io")
const ioClient = require("socket.io-client")
const app = require('express')()
const server = require('http').createServer(app);

const { makeP2P } = require("./makeP2P.js")

module.exports.p2p = makeP2P({ io, ioClient, server })
