const { hive } = require('../blockchain/index.js')
const { eventEmitter } = require("../eventHandler/index.js")
const { validatorDatabase } = require("../dataAccess/index.js")

async function checkValidators(){
  // eventEmitter.on("checkValidators", async () => {
    let auths = await hive.getAuthoritiesInfo()
    let validators = await validatorDatabase.findAll()
    let active = validators.filter((val) => val.isActive == true)
    let toBeRemoved = active.filter((val) => val.strikes > 3)
    if (toBeRemoved){
      for (i in toBeRemoved){

      }
    }
  // })
}

module.exports.checkValidators = checkValidators
