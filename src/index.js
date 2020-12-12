require('dotenv').config();
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const { hive, ethereum, emitter } = require("./blockchain/index.js")

hive.streamBlockchain()

emitter.on("stakeModifyingOperation", (data) => {
  console.log(1, data)
})
