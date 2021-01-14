exports.makeP2P = ({ hive, validatorDatabase, eventEmitter }) => {
  return Object.freeze({
    listen,
    sendEventByName
  })

  async function listen(){
    eventEmitter.on('new_block', (block_num, block) => {
      for (const transaction of block.transactions) {
        for (const op of transaction.operations){
          let type = op[0]
          let data = op[1]
          if (type == 'custom_json' && data.id == 'wrapped_hive_p2p' && data.required_auths && data.required_auths.length > 0){
            processTransaction(data, transaction.transaction_id)
          }
        }
      }
    })
  }

  async function processTransaction(data, transaction_id){
    try {
      let json = JSON.parse(data.json)
      switch (json.name) {
        case 'propose_transaction':
          // if (data.required_auths[0] != process.env.VALIDATOR){
            eventEmitter.emit("propose_transaction", JSON.parse(json.data), transaction_id)
          // }
          break;
        case 'signature':
          eventEmitter.emit("signature", JSON.parse(json.data), data.required_auths)
          break;
        case 'network_state':
          eventEmitter.emit("network_state", JSON.parse(json.data))
          break;
        case 'propose_validator_removal':
          eventEmitter.emit("propose_validator_removal", JSON.parse(json.data))
          break;
        case 'propose_new_validator':
          eventEmitter.emit("propose_new_validator", JSON.parse(json.data))
          break;
        case 'whitelist_validator':
          if (data.required_auths[0] == process.env.VALIDATOR){
            eventEmitter.emit("whitelist_validator", JSON.parse(json.data))
          };
          break;
      }
    } catch (e){
      console.log(e)
    }
  }

  async function sendEventByName(eventName, eventData){
    try {
      let transaction = await hive.sendCustomJson(eventName, JSON.stringify(eventData));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
