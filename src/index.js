require('dotenv').config();
const { p2p } = require("./p2p/index.js")
const { eventEmitter } = require("./eventHandler/index.js")
const { hive, ethereum } = require("./blockchain/index.js")
const governance = require("./governance/index.js")
const blockchainEvents = require("./blockchainEvents/index.js")

p2p.listen()
// governance.listen()
//
// hive.streamBlockchain()
ethereum.streamEthereumEvents()
blockchainEvents.blockchainEventsListener()
