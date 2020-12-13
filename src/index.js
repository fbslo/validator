require('dotenv').config();
const { p2p } = require("./p2p/index.js")
const { hive, ethereum, emitter } = require("./blockchain/index.js")

hive.streamBlockchain()

emitter.on("hiveConversion", (data) => {
  console.log('emmited event', data)
})
