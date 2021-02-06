require('dotenv').config();
const { p2p } = require("./p2p/index.js")
const { eventEmitter } = require("./eventHandler/index.js")
const { hive, ethereum } = require("./blockchain/index.js")
const governance = require("./governance/index.js")
const blockchainEvents = require("./eventHandler/blockchainEvents/index.js")
const p2pEvents = require("./eventHandler/p2pEvents/index.js")

// hive.streamBlockchain()
// ethereum.streamEthereumEvents()
//
// p2p.listen()
// p2pEvents.p2pEventsListener()
// blockchainEvents.blockchainEventsListener()
governance.listen()
