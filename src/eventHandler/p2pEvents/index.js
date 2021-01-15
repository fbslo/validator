const { hive } = require("../../blockchain/index.js")
const { validator } = require("../../validator/index.js")
const { transactionDatabase, statusDatabase } = require('../../dataAccess/index.js')
const { eventEmitter } = require("../index.js")
const { p2p } = require("../../p2p/index.js")

async function p2pEventsListener(){
  let tx = await hive.getTransactionByID('f401c5d396924376605f2bf671dd40d37d88187e')
  console.log(JSON.parse(JSON.parse(tx.operations[0][1].json).data))
  eventEmitter.on('propose_transaction', async (data, proposalTransaction) => {
    console.log('new proposal', data)
    if (data.chain == 'hive'){
      let signedTransaction = await validator(`hive`, data.referenceTransaction, data.transaction);
      if (signedTransaction){
        p2p.sendEventByName(`signature`, {
          chain: 'hive',
          referenceTransaction: data.referenceTransaction,
          proposalTransaction: proposalTransaction,
          signature: signedTransaction.signatures[0]
        })
      } else {
        console.log(`Signing failed:`, signedTransaction)
      }
    } else if (data.chain == 'ethereum'){
      let signedTransaction = await validator(`ethereum`, data.referenceTransaction);
      if (signedTransaction){
        p2p.sendEventByName(`signature`, {
          chain: 'ethereum',
          referenceTransaction: data.referenceTransaction,
          proposalTransaction: proposalTransaction,
          signature: signedTransaction.signature
        })
      } else {
        console.log(`Signing failed:`, signedTransaction)
      }
    }
  })

  eventEmitter.on('signature', async (data, sender) => {
    try {
      console.log('new signature', data)
      await sleep(10000)
      if (data.chain == 'hive'){
        let isValidSender = false
        let signed = await hive.verifySignature(data.signature, data.proposalTransaction)
        for (i in signed){
          if (signed[i] == sender[0]) isValidSender = true;
        }
        let { requiredSignatures, auths } = await hive.getAuthoritiesInfo()
        if (isValidSender && auths.includes(sender[0])){
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
          if (signatures.length >= requiredSignatures && currentValidator == process.env.VALIDATOR){
            isAlreadyStored.sigantures = []
            isAlreadyStored.signatures.push(...signatures)
            let broadcast = await hive.broadcast(isAlreadyStored)
          }
        }  else {
          console.log(`Signature was signed by ${signed}, but sent by ${sender[0]}`)
        }
      } else if (data.chain == 'ethereum') {
        // NOTE: since ethereum broadcasting is handled by users, we don't have to do anything here ;)
      }
    } catch (e) {
      console.log(e)
      // TODO: handle errors
    }
  })

  eventEmitter.on('propose_new_validator', async (data) => {
    // TODO: add new propsed validator to db
  })

  eventEmitter.on('whitelist_validator', async (data) => {
    let storeNewWhitelisted = await statusDatabase.addWhitelistedValidator(data.username)
  })
}

function sleep(ms){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

module.exports.p2pEventsListener = p2pEventsListener
