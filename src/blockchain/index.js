const { Hive } = require('@splinterlands/hive-interface');
const dhive = require('@hiveio/dhive');
const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');

const { userDatabase } = require("../dataAccess/index.js")
const { eventEmitter } = require("../eventHandler/index.js")
const { tokenABI } = require("../utils/tokenABI.js")

const hive = new Hive();
const web3 = new Web3(process.env.ETHEREUM_ENDPOINT);
const inputDataDecoder = new InputDataDecoder(tokenABI);

const { buildMakeHiveInterface } = require("./hive.js");
const { buildMakeEthereumInterface } = require("./ethereum.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, userDatabase, dhive })
const makeEthereumInterface = buildMakeEthereumInterface({ web3, eventEmitter, tokenABI, inputDataDecoder })

module.exports.hive = makeHiveInterface
module.exports.ethereum = makeEthereumInterface
