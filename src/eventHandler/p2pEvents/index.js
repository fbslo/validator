const { hive } = require("../../blockchain/index.js")
const { validator } = require("../../validator/index.js")
const { transactionDatabase, statusDatabase } = require('../../dataAccess/index.js')
const { eventEmitter } = require("../index.js")

function p2pEventsListener(){
  eventEmitter.on('propose_transaction', async (data) => {
    console.log('proposing transaction:', data)
    if (data.chain == 'hive'){
      let signedTransaction = await validator(`hive`, data.referenceTransaction, data.transaction);
      sendEventByName(`signature`, {
        referenceTransaction: data.referenceTransaction,
        signature: signedTransaction.signatures[0]
      })
    } else if (data.chain == 'ethereum'){
      // TODO: do ethereum
    }
  })

  eventEmitter.on('signature', async (data) => {
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
  })

  eventEmitter.on('propose_new_validator', (data) => {
    // TODO: add new propsed validator to db
  })

  eventEmitter.on('whitelist_validator', (data) => {
    // TODO: add whitelisted validator to database
  })
}

module.exports.p2pEventsListener = p2pEventsListener
