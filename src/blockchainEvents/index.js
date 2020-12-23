const { eventEmitter } = require("../eventHandler/index.js")
const { validator } = require("../validator/index.js")
const { transactionDatabase, statusDatabase } = require('../dataAccess/index.js')
const { p2p } = require("../p2p/index.js")
const { hive, ethereum } = require("../blockchain/index.js")

eventEmitter.on(`hiveDeposit`, (data) => {
  // TODO: prepare eth tx
})

eventEmitter.on(`validatorVote`, (data) => {
  // TODO: update valditaor votes
})

eventEmitter.on(`validatorUpdate`, (data) => {
  // TODO: update valditator votes
})

eventEmitter.on(`modifiedStake`, (data) => {
  // TODO: update modified stake
})

eventEmitter.on(`modifiedStake`, (data) => {
  // TODO: update modified stake
})

eventEmitter.on(`ethereumConversion`, async (data) => {
  let notProcessedTransactions = []
  for (i in data){
    let isAlreadyProcessed = await transactionDatabase.findByReferenceID(data[i].transactionHash)
    if (!isAlreadyProcessed) notProcessedTransactions.push(data[i])
  }

  for (i in notProcessedTransactions){
    await transactionDatabase.insert({
      referenceTransaction: notProcessedTransactions[i].transactionHash,
      isProcessed: false,
      createdAt: new Date().getTime()
    })
    let currentValidator = await statusDatabase.findByName(`headValidator`)
    if (currentValidator[0] == process.env.VALIDATOR){
      let decodedTransactionData = await ethereum.decode(notProcessedTransactions[i].raw.data)
      p2p.sendEventByName('requestWrappedToHiveConversionSiganture', {
        referenceTransaction: notProcessedTransactions[i].transactionHash,
        transaction: hive.prepareTransferTransaction({
          from: process.env.HIVE_DEPOSIT_ACCOUNT,
          to: decodedTransactionData.inputs[1],
          amount: decodedTransactionData.inputs[0].toString() / Math.pow(10, process.env.ETHEREUM_TOKEN_PRECISION),
          currency: "HIVE",
          memo: `${amount} wHIVE converted`
        })
      })
    }
  }
})
