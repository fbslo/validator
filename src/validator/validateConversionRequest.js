module.exports.buildMakeValidateConversionRequest = ({ hive, ethereum, transactionDatabase, isValidHash }) => {
  return async function makeValidateConversionRequest(
    conversionDirection,
    referenceTransaction,
    proposedTransaction,
    createdOn = Date.now(),
    updatedOn = Date.now()
  ){
    if (!conversionDirection){
      throw new Error(`Conversion direction is required`)
    }
    if (conversionDirection != 'hive' && conversionDirection != 'ethereum'){
      throw new Error(`Conversion direction must be hive or ethereum`)
    }
    if (!referenceTransaction){
      throw new Error(`Reference transaction is required`)
    }
    if (!proposedTransaction || proposedTransaction.length < 1){
      throw new Error(`Proposed transaction is required`)
    }
    if (typeof referenceTransaction != 'string'){
      throw new Error(`Reference transaction must be a string`)
    }
    if (typeof proposedTransaction != 'object' && typeof proposedTransaction != 'string'){
      throw new Error(`Proposed transaction must be object or string`)
    }

    let signedTransaction = false;
    try {
      if (conversionDirection == 'hive'){
        signedTransaction = await validateConversionToHive(referenceTransaction, proposedTransaction)
      } else {
        signedTransaction = await validateConversionToEthereum(referenceTransaction, proposedTransaction)
      }
    } catch (e) {
      console.log(`signedTransaction failed or rejected: ${e.message}`)
    }

    return signedTransaction;
  }

  async function validateConversionToHive(referenceTransaction, transaction){
    if (typeof transaction == 'string') transaction = JSON.parse(transaction)
    let ethereumTransaction = await ethereum.getTransaction(referenceTransaction);
    let decodedTransactionData = await ethereum.decode(ethereumTransaction.input)

    if (ethereumTransaction.to.toLowerCase() != process.env.CONTRACT_ADDRESS){
      throw new Error(`Transaction must be to selected smart contract`)
    }
    if (decodedTransactionData.method != process.env.CONTRACT_METHOD){
      throw new Error(`Method must be ${process.env.CONTRACT_METHOD}`)
    }
    if (transaction.operations[0][0] != 'transfer'){
      throw new Error(`Transaction operation must be transfer`)
    }
    if (decodedTransactionData.inputs[0].toString() / Math.pow(10, process.env.ETHEREUM_TOKEN_PRECISION) != transaction.operations[0][1].amount.split(" ")[0]){
      throw new Error(`Amount burned must match proposed amount`)
    }
    if (transaction.operations[0][1].amount.split(" ")[1] != 'HIVE'){
      throw new Error(`Proposed transfer currency must be HIVE`)
    }
    if (decodedTransactionData.inputs[1] != transaction.operations[0][1].to){
      throw new Error(`Address from burn transaction must match proposed recepient`)
    }
    // TODO: sign transaction
    let signedTransaction = await hive.sign(transaction);
    return signedTransaction;
  }

  async function validateConversionToEthereum(referenceTransaction, transaction){
    // TODO:
  }
}
