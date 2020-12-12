const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Hive } = require('@splinterlands/hive-interface');
const hive = new Hive();
const { userDatabase } = require("../dataAccess/index.js")

const { buildMakeHiveInterface } = require("./hive.js");

const makeHiveInterface = buildMakeHiveInterface({ hive, eventEmitter, userDatabase, getUserStake })

async function getUserStake(user){
  let accounts = await hive.api('get_accounts', [[user]]);
  let activeStake = accounts[0].vesting_shares.split(" ")[0] * Math.pow(10, 6) - accounts[0].to_withdraw
  return activeStake > 0 ? activeStake : 0;
}

module.exports.hive = makeHiveInterface
module.exports.emitter = eventEmitter
