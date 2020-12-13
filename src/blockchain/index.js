const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Hive } = require('@splinterlands/hive-interface');
const hive = new Hive();
const { userDatabase } = require("../dataAccess/index.js")
const { tokenABI } = require("../utils/tokenABI.js")

const { buildMakeHiveInterface } = require("./hive.js");
// const { buildMakeEthereumInterface } = require("./ethereum.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, userDatabase })
// const makeEthereumInterface = buildMakeEthereumInterface({ web3, eventEmitter, tokenABI })

module.exports.hive = makeHiveInterface
// module.exports.ethereum = makeEthereumInterface
module.exports.emitter = eventEmitter
