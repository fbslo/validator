require('dotenv').config();
const { p2p } = require("./p2p/index.js")
const { eventEmitter } = require("./eventHandler/index.js")
const { hive, ethereum } = require("./blockchain/index.js")

p2p.listen()

hive.streamBlockchain()
// ethereum.streamEthereumEvents()
//
// emitter.on("hiveConversion", (data) => {
//   console.log('emmited event', data)
// })
//
// emitter.on("ethereumConversion", (data) => {
//   console.log('emmited event', data)
// })
