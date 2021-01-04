exports.makeP2P = ({ hive, validatorDatabase, p2pEventsHandler }) => {
  return Object.freeze({
    listen,
    getConnectedNodes,
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
    // TODO:
  }

  async function getConnectedNodes(){
    // TODO: get nodes  from db
    return false;
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
