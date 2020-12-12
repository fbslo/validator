require('dotenv').config();
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const { hive, ethereum, emitter } = require("./blockchain/index.js")

hive.streamBlockchain()

emitter.on("hiveDeposit", (data) => {
  console.log('emmited event', data)
})
