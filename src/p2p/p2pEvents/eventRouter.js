const { validator } = require("../../validator/index.js")
const { hive } = require("../../blockchain/index.js")

const p2pEventsHandler = async (event, data) => {
  try {
    switch (event){
      case "requestHiveToWrappedConversionSiganture":
        break;
      case "requestWrappedToHiveConversionSiganture":
        let signature = await validator(`hive`, data.referenceTransaction, data.transaction);
        break;
      case "sharePeerList":
        break;
      case "heartbeat":
        break;
      case "requestPeerSiganture":
        break;
      case "shareSignature":
        break;
    }
  } catch (e) {
    console.log(`P2P event failed or rejected: ${e}`)
  }
}

module.exports.p2pEventsHandler = p2pEventsHandler
