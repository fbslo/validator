const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Hive } = require('@splinterlands/hive-interface');
const hive = new Hive();

const makeHiveInterface = require("./hive.js");
