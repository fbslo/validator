var users = [] //store users in memory instead of constant db calls

exports.buildMakeHiveInterface = ({ hive, eventEmitter, userDatabase, getUserStake }) => {
  return Object.freeze({
    streamBlockchain,
    validateTransfer,
    validateCustomJson,
    validateStakeModifyingOperation
  })

  async function streamBlockchain(callback){
    if (users.length == 0) {
      let usersFromDatabase = await userDatabase.findAll()
      users = usersFromDatabase.map(user => { return user['username'] })
    }
    hive.stream({
      on_block: checkBlock,
      irreversible: process.env.ENVIRONMENT == "production" ? true : false,
    })
  }

  async function checkBlock(block_num, block){
    for (const transaction of block.transactions) {
      for (const op of transaction.operations){
        let type = op[0]
        let data = op[1]
        routeTransaction(type, data)
      }
    }
  }

  async function routeTransaction(type, data){
    try {
      switch (type){
        case 'transfer':
          validateTransfer(data);
          break;
        case 'custom_json':
          validateCustomJson(data);
          break;
        case 'claim_reward_balance':
        //case 'producer_reward':
        //case 'withdraw_vesting':
        case 'transfer_to_vesting':
        case 'fill_vesting_withdraw':
          validateStakeModifyingOperation(type, data);
          break;
      }
    } catch (e) {
      console.log(`Error while processing HIVE transaction: ${e.toString()}`)
    }
  }

  function validateTransfer(data){
    if (data.to == process.env.HIVE_DEPOSIT_ACCOUNT){
      if (!data.from || !data.to || !data.amount || !data.memo){
        throw new Error("Transfer data is required")
      }
      let transferDetails = {
        from: data.from,
        to: data.to,
        amount: Number(data.amount.split(" ")[0]),
        currency: data.amount.split(" ")[1],
        memo: data.memo
      }
      eventEmitter.emit('hiveDeposit', transferDetails)
    }
  }

  async function validateCustomJson(data){
    if (data.id == 'wrapped_hive' && data.required_auths[0]){
      let json = JSON.parse(data.json)
      if (!json.type){
        throw new Error("JSON type is required")
      }
      if (!users.includes(data.required_auths[0])) {
        users.push(data.required_auths[0])
        userDatabase.insert({
          username: data.required_auths[0],
          stake: await getUserStake(data.required_auths[0])
        })
      }
      switch (json.type){
        case 'validator_vote':
          if (!json.validator || !json.approve){
            throw new Error("JSON validator and approve are required")
          }
          eventEmitter.emit('validatorVote', {
            validator: json.validator,
            approve: json.approve == true || 'true' ? true : false
          })
          break;
        case 'validator_update':
          if (!json.validator || !json.approve){
            throw new Error("JSON validator and approve are required")
          }
          eventEmitter.emit('validatorUpdate', json)
          break;
        case 'validator_creation':
          eventEmitter.emit('validatorCreation', json)
          break;
      }
    }
  }

  async function validateStakeModifyingOperation(type, data){
    switch (type){
      case 'claim_reward_balance':
        if (users.includes(data.account)){
          eventEmitter.emit('modifiedStake', {
            username: data.account,
            stakeChange: data.reward_vests.amount
          })
        }
        break;
      case 'transfer_to_vesting':
        if (users.includes(data.to)){
          eventEmitter.emit('modifiedStake', {
            username: data.to,
            stakeChange: data.amount.amount
          })
        }
        break;
      case 'withdraw_vesting':
        if (users.includes(data.account)){
          eventEmitter.emit('modifiedStake', {
            username: data.account,
            stakeChange: -data.vesting_shares.amount
          })
        }
        break;
      // NOTE: since we are not scaning virtual ops, we cannot detect power downs,
      // so entrire stake is deducted at once at start. maybe fix in the future
      // case 'fill_vesting_withdraw':
      //   if (users.includes(data.from_account)){
      //     eventEmitter.emit('modifiedStake', {
      //       username: data.from_account,
      //       stakeChange: -data.withdrawn.split(" ")[0]
      //     })
      //   }
      //   break;
    }
  }

  async function getUserStake(user){
    let accounts = await hive.api('get_accounts', [[user]]);
    let activeStake = accounts[0].vesting_shares.split(" ")[0] * Math.pow(10, 6) - accounts[0].to_withdraw
    return activeStake > 0 ? activeStake : 0;
  }
}
