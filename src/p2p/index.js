const socket = require("socket.io")
const socketClient = require("socket.io-client")
const { makeP2P } = require("./makeP2P.js")

module.exports.p2p = makeP2P({ socket, socketClient })
