const { eventEmitter } = require("../eventHandler/index.js")
const { validator } = require("../validator/index.js")
const { transactionDatabase } = require('../dataAccess/index.js')

eventEmitter.on(`hiveDeposit`, (data) => {
  // TODO: prepare eth tx
})

eventEmitter.on(`validatorVote`, (data) => {
  // TODO: update valditaor votes
})

eventEmitter.on(`validatorUpdate`, (data) => {
  // TODO: update valditaor votes
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
  }
})
