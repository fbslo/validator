exports.makeP2P = ({ hive, validatorDatabase, p2pEventsHandler }) => {
  return Object.freeze({
    listen,
    sendEventByName
  })

  async function listen(){
    hive.blockchainCallback((block) => {
      for (const transaction of block.transactions) {
        for (const op of transaction.operations){
          let type = op[0]
          let data = op[1]
          if (type == 'custom_json' && data.id == 'wrapped_hive_p2p'){
            processTransaction(data)
          }
        }
      }
    })
  }

  async function processTransaction(data){
    try {
      let json = JSON.parse(data.json)
      switch (json.name) {
        case 'propose_transaction':
          p2pEventsHandler.emit("propose_transaction", json.data)
          break;
        case 'signature':
          p2pEventsHandler.emit("signature", json.data)
          break;
        case 'network_state':
          p2pEventsHandler.emit("network_state", json.data)
          break;
        case 'propose_validator_removal':
          p2pEventsHandler.emit("propose_validator_removal", json.data)
          break;
      }
    } catch (e){
      console.log(e)
    }
  }

  async function sendEventByName(eventName, eventData){
    try {
      let transaction = await hive.sendCustomJson(`wrapped_hive_p2p`, {
        name: eventData,
        data: eventData
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
