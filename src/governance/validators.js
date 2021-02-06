const { hive } = require('../blockchain/index.js')
const { p2p } = require('../p2p/index.js')
const { eventEmitter } = require("../eventHandler/index.js")
const { validatorDatabase } = require("../dataAccess/index.js")
const { statusDatabase } = require("../dataAccess/index.js")

async function checkValidators(){
  eventEmitter.on("checkValidators", async () => {
    let authsInfo = await hive.getAuthoritiesInfo()
    let validators = await validatorDatabase.findAll()
    let active = validators.filter((val) => val.isActive == true)
    //check if any validator has to be removed
    let toBeRemoved = active.filter((val) => val.strikes > 3)
    let currentHeadValidator = await statusDatabase.findByName("headValidator")
    if (toBeRemoved && currentHeadValidator[0].data == process.env.VALIDATOR){
      for (i in toBeRemoved){
        p2p.sendEventByName(`kick_validator`, {
          username: toBeRemoved[i].username,
          strikes: toBeRemoved[i].strikes
        })
      }
    }
    //compare auths and our database
    let databaseArray = active.map((obj) => { return obj.username })
    let authsArray = authsInfo.auths.map((obj) => { return obj[0] })
    let onlyInDatabase = databaseArray.filter(x => !authsArray.includes(x)) //this auths have to be disabled
    let onlyInAuths = authsArray.filter(x => !databaseArray.includes(x)) //this auths have to be added
    if (onlyInDatabase){
      for (i in onlyInDatabase){
        validatorDatabase.updateStatusByUsername(onlyInDatabase[i], false)
      }
    }
    if (onlyInAuths){
      for (i in onlyInAuths){
        let isAlreadyStored = await validatorDatabase.findByUsername(onlyInAuths[i])
        if (isAlreadyStored){
          validatorDatabase.updateStatusByUsername(onlyInAuths[i], true)
        } else {
          validatorDatabase.insert({
            username: onlyInAuths[i],
            strikes: 0,
            isEnabled: true
          })
        }
      }
    }
  })
}

module.exports.checkValidators = checkValidators
