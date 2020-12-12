const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Hive } = require('@splinterlands/hive-interface');
const hive = new Hive();
const { userDatabase } = require("../dataAccess/index.js")

const { buildMakeHiveInterface } = require("./hive.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, userDatabase })

module.exports.hive = makeHiveInterface
module.exports.emitter = eventEmitter
