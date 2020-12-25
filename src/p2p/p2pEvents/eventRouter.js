const { validator } = require("../../validator/index.js")
const { hive } = require("../../blockchain/index.js")
const { p2p } = require("../index.js")
const { transactionDatabase, statusDatabase } = require('../../dataAccess/index.js')

const p2pEventsHandler = async (event, data) => {
  try {
    switch (event){
      case "requestHiveToWrappedConversionSiganture":
        break;
      case "requestWrappedToHiveConversionSiganture":
        let signedTransaction = await validator(`hive`, data.referenceTransaction, data.transaction);
        p2p.sendEventByName(`shareSignature`, {
          referenceTransaction: data.referenceTransaction,
          signature: signedTransaction.signatures[0]
        })
        break;
      case "sharePeerList":
        break;
      case "heartbeat":
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
        if (signatures.length >= requiredSignatures && currentValidator == process.env.VALIDATOR){ // TODO: add threshold
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
