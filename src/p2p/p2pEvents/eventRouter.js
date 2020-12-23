const { validator } = require("../../validator/index.js")

const p2pEventsHandler = (event, data) => {
  try {
    switch (event){
      case "requestHiveToWrappedConversionSiganture":
        break;
      case "requestWrappedToHiveConversionSiganture":
        validator(`hive`, data.referenceTransaction, data.transaction)
        break;
      case "sharePeerList":
        break;
      case "heartbeat":
        break;
      case "requestPeerSiganture":
        break;
    }
  } catch (e) {
    console.log(`P2P event failed or rejected: ${e.name}`)
  }
}

module.exports.p2pEventsHandler = p2pEventsHandler
