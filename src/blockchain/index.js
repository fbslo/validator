const { Hive } = require('@splinterlands/hive-interface');
const dhive = require('@hiveio/dhive');
const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');

const { eventEmitter } = require("../eventHandler/index.js")
const { tokenABI } = require("../utils/tokenABI.js")
const { multisigABI } = require("../utils/multisigABI.js")

const hive = new Hive();
const web3 = new Web3(process.env.ETHEREUM_ENDPOINT);
const inputDataDecoder = new InputDataDecoder(tokenABI);

const { buildMakeHiveInterface } = require("./hive.js");
const { buildMakeEthereumInterface } = require("./ethereum.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, dhive })
const makeEthereumInterface = buildMakeEthereumInterface({ web3, eventEmitter, tokenABI, multisigABI, inputDataDecoder })

module.exports.hive = makeHiveInterface
module.exports.ethereum = makeEthereumInterface
