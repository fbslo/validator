const { hive } = require("../../blockchain/index.js")
const { validator } = require("../../validator/index.js")
const { transactionDatabase, statusDatabase } = require('../../dataAccess/index.js')
const { eventEmitter } = require("../index.js")
const { p2p } = require("../../p2p/index.js")

function p2pEventsListener(){
  eventEmitter.on('propose_transaction', async (data, proposalTransaction) => {
    if (data.chain == 'hive'){
      let signedTransaction = await validator(`hive`, data.referenceTransaction, data.transaction);
      p2p.sendEventByName(`signature`, {
        referenceTransaction: data.referenceTransaction,
        signature: signedTransaction.signatures[0],
        proposalTransaction: proposalTransaction
      })
    } else if (data.chain == 'ethereum'){
      // TODO: do ethereum
    }
  })

  eventEmitter.on('signature', async (data, sender) => {
    let signed = await hive.verifySignature(data.signature, data.proposalTransaction)
    // TODO: check if signer is valid validator
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
  })

  eventEmitter.on('propose_new_validator', async (data) => {
    // TODO: add new propsed validator to db
  })

  eventEmitter.on('whitelist_validator', async (data) => {
    let storeNewWhitelisted = await statusDatabase.addWhitelistedValidator(data.username)
  })
}

module.exports.p2pEventsListener = p2pEventsListener
