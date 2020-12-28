const { eventEmitter } = require("../eventHandler/index.js")
const { statusDatabase } = require("../dataAccess/index.js")
const { hive } = require('../blockchain/index.js')

async function listen(){
  console.log("Listening to governance changes...")
  eventEmitter.on(`switchHeadValidator`, async (data) => {
    let scheduleNumber = await getScheduleNumber(data.headBlock)
    let newHeadValidator = await getNewHeadValidator(scheduleNumber)
    console.log(`New head validator:`, newHeadValidator)
    let saveNewHeadValidator = await statusDatabase.updateByName(`headValidator`, newHeadValidator)
  })
}

async function getScheduleNumber(headBlock){
  let accountDetails = await hive.getAccount(process.env.HIVE_DEPOSIT_ACCOUNT)
  let n = accountDetails.active.account_auths.length + accountDetails.active.key_auths.length
  let blockHash = await hive.getBlockHash(headBlock)
  let scheduleNumber = parseInt(blockHash, 16) % n
  return scheduleNumber;
}

async function getNewHeadValidator(scheduleNumber){
  let accountDetails = await hive.getAccount(process.env.HIVE_DEPOSIT_ACCOUNT)
  if (scheduleNumber == 0) scheduleNumber = 1
  let validator = accountDetails.active.account_auths[scheduleNumber - 1]
  return validator[0];
}

module.exports.listen = listen
