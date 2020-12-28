const io = require("socket.io")
const ioClient = require("socket.io-client")
const server = require('http').createServer()
const { validatorDatabase } = require("../dataAccess/index.js")
const { p2pEventsHandler } = require("../eventHandler/p2pEvents/eventRouter.js")

const { makeP2P } = require("./makeP2P.js")

server.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`))

module.exports.p2p = makeP2P({ io, ioClient, server, validatorDatabase, p2pEventsHandler })
