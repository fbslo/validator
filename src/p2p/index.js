const socket = reqiure("socket.io")
const socketClient = require("socket.io-client")
const { makeP2P } = reqiure("./makeP2P.js")

module.exports.p2p = makeP2P({ socket, socketClient })
