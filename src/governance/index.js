const { eventEmitter } = require("../eventEmitter/index.js")
const { statusDatabase } = require("../dataAccess/index.js")
const { hive } = require('../blockchain/index.js')

eventEmitter.on(`switchHeadValidator`, async (data) => {
  let scheduleNumber = await getScheduleNumber(data.headBlock)
  let newHeadValidator = await getNewHeadValidator(scheduleNumber)
  console.log(newHeadValidator)
  let saveNewHeadValidator = await statusDatabase.insert({
    name: 'headValidator',
    username: newHeadValidator
  })
})

async function getScheduleNumber(headBlock){
  let auths = await get_auths()
  let n = auths.account_auths.length + auths.key_auths.length
  let blockHash = await hive.getBlockHash(headBlock)
  let scheduleNumber = parseInt(blockHash, 16) % n
  return scheduleNumber;
}

async function getNewHeadValidator(scheduleNumber){
  let accountDetails = await hive.getAccount(process.env.HIVE_DEPOSIT_ACCOUNT)
  if (scheduleNumber == 0) scheduleNumber = 1
  let validator = accountDetails.auths.account_auths[scheduleNumber - 1]
  return validator;
}
