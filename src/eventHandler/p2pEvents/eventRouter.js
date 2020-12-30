const { hive } = require("../../blockchain/index.js")
const { validator } = require("../../validator/index.js")
const { transactionDatabase, statusDatabase } = require('../../dataAccess/index.js')
const { heartbeat } = require("./network/heartbeat.js")

const p2pEventsHandler = async (event, data, sendEventByName) => {
  try {
    switch (event){
      case "requestHiveToWrappedConversionSiganture":
        break;
      case "requestWrappedToHiveConversionSiganture":
        let signedTransaction = await validator(`hive`, data.referenceTransaction, data.transaction);
        sendEventByName(`shareSignature`, {
          referenceTransaction: data.referenceTransaction,
          signature: signedTransaction.signatures[0]
        })
        break;
      case "sharePeerList":
        break;
      case "heartbeat":
        sendEventByName(`heartbeatResponse`, {
          username: process.env.VALIDATOR,
          signature: 
        })
        break;
      case "heartbeatResponse":
        break;
      case "requestPeerSiganture":
        break;
      case "shareSignature":
        // TODO: verify signatue is correct
        let isAlreadyStored = await transactionDatabase.findByReferenceID(data.referenceTransaction)
        let currentValidator = await statusDatabase.findByName(`headValidator`)
        let signatures = []
        if (!isAlreadyStored) {
          await transactionDatabase.insert({
            referenceTransaction: data.referenceTransaction,
            signatures: [data.signature]
          })
          signatures.push(data.signatue)
        } else {
          await transactionDatabase.updateByReferenceID(data.referenceTransaction, {
            $push: {  signatures: data.signature }
          })
          signatures.push(isAlreadyStored.signatures)
          signatures.push(data.signatue)
        }
        let { requiredSignatures } = hive.getAuthoritiesInfo()
        if (signatures.length >= requiredSignatures && currentValidator == process.env.VALIDATOR){
          isAlreadyStored.sigantures = []
          isAlreadyStored.signatures.push(...signatures)
          let broadcast = await hive.broadcast(isAlreadyStored)
        }
        break;
    }
  } catch (e) {
    console.log(`P2P event failed or rejected: ${e}`)
  }
}

module.exports.p2pEventsHandler = p2pEventsHandler
