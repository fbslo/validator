module.exports.buildMakeValidateConversionRequest = ({ hive, ethereum, transactionDatabase, isValidHash }) => {
  return async function makeValidateConversionRequest(
    conversionDirection,
    referenceTransaction,
    proposedTransaction,
    headValidator,
    createdOn = Date.now(),
    updatedOn = Date.now(),
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
    if (conversionDirection == 'hive' && (!proposedTransaction || proposedTransaction.length < 1)){
      throw new Error(`Proposed transaction is required`)
    }
    if (typeof referenceTransaction != 'string'){
      throw new Error(`Reference transaction must be a string`)
    }
    if (conversionDirection == 'hive' && (typeof proposedTransaction != 'object' && typeof proposedTransaction != 'string')){
      throw new Error(`Proposed transaction must be object or string`)
    }

    let signedTransaction = false;
    try {
      if (conversionDirection == 'hive'){
        signedTransaction = await validateConversionToHive(referenceTransaction, proposedTransaction, headValidator)
      } else {
        signedTransaction = await validateConversionToEthereum(referenceTransaction, proposedTransaction)
      }
    } catch (e) {
      console.log(`signedTransaction failed or rejected: ${e.message}`)
    }

    return signedTransaction;
  }

  async function validateConversionToHive(referenceTransaction, transaction, headValidator){
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
    if (decodedTransactionData.inputs[0].toString() / Math.pow(10, process.env.ETHEREUM_TOKEN_PRECISION) * 0.995 != transaction.operations[0][1].amount.split(" ")[0]){
      throw new Error(`Amount burned must match proposed amount`)
    }
    if (transaction.operations[0][1].amount.split(" ")[1] != 'HIVE'){
      throw new Error(`Proposed transfer currency must be HIVE`)
    }
    if (decodedTransactionData.inputs[1] != transaction.operations[0][1].to){
      throw new Error(`Address from burn transaction must match proposed recepient`)
    }
    if (transaction.operations.length > 2){
      throw new Error(`Only 2 operations allowed`)
    }
    if (transaction.operations[1][0] != 'transfer'){
      throw new Error(`2nd transaction operation must be transfer`)
    }
    if (decodedTransactionData.inputs[0].toString() / Math.pow(10, process.env.ETHEREUM_TOKEN_PRECISION) * 0.005!= transaction.operations[1][1].amount.split(" ")[0]){
      throw new Error(`Validator fee must be 0.5%`)
    }
    if (transaction.operations[1][1].to != headValidator){
      throw new Error(`Fee must be paid to head validator`)
    }
    let signedTransaction = await hive.sign(transaction);
    return signedTransaction;
  }

  async function validateConversionToEthereum(referenceTransaction){
    let hiveTransaction = await hive.getTransactionByID(referenceTransaction);

    if (hiveTransaction.operations[0][0] != 'transfer'){
      throw new Error(`Transaction is not transfer`)
    }
    if (hiveTransaction.operations[0][1].to != process.env.HIVE_DEPOSIT_ACCOUNT){
      throw new Error(`Recipient is not deposit account`)
    }
    if (!ethereum.isAddress(hiveTransaction.operations[0][1].memo)){
      throw new Error(`Memo is not ethereum address`)
    }
    let to = hiveTransaction.operations[0][1].memo;
    let amount = hiveTransaction.operations[0][1].amount.split(" ")[0] * Math.pow(10, process.env.TOKEN_PRECISION);
    let signedTransaction = await ethereum.prepareAndSignMessage(to, amount, referenceTransaction);
    return signedTransaction;
  }
}
