const { Hive } = require('@splinterlands/hive-interface');
const hive = new Hive();
const Web3 = require('web3');
const web3 = new Web3(process.env.ETHEREUM_ENDPOINT);

const { userDatabase } = require("../dataAccess/index.js")
const { eventEmitter } = require("../eventHandler/index.js")
const { tokenABI } = require("../utils/tokenABI.js")

const { buildMakeHiveInterface } = require("./hive.js");
const { buildMakeEthereumInterface } = require("./ethereum.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, userDatabase })
const makeEthereumInterface = buildMakeEthereumInterface({ web3, eventEmitter, tokenABI })

module.exports.hive = makeHiveInterface
module.exports.ethereum = makeEthereumInterface
