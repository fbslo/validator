module.exports.buildMakeValidateConversionRequest = ({ hash, transactions }) => {
  return async function makeValidateConversionRequest({
    conversionDirection,
    referenceTransaction,
    proposedTransaction,
    createdOn = Date.now(),
    updatedOn = Date.now()
  }){
    if (!conversionDirection){
      throw new Error(`Conversion direction is required`)
    }
    if (conversionDirection != 'hive' || conversionDirection != 'ethereum'){
      throw new Error(`Conversion direction must be hive or ethereum`)
    }
    if (!referenceTransaction){
      throw new Error(`Reference transaction is required`)
    }
    if (!hash.isValid(referenceTransaction)){
      throw new Error(`Reference transaction must be valid`)
    }
    if (!proposedTransaction || proposedTransaction.length < 1){
      throw new Error(`Proposed transaction is required`)
    }
    if (typeof referenceTransaction != 'string'){
      throw new Error(`Reference transaction must be a string`)
    }

    let isTransactionValid;
    if (conversionDirection == 'hive'){
      isTransactionValid = await validateConversionToHive(referenceTransaction, transaction)
    } else {
      isTransactionValid = await validateConversionToEthereum(referenceTransaction, transaction)
    }

    return isTransactionValid;
  }

  async function validateConversionToHive(referenceTransaction, transaction){
    if (typeof transaction == 'string') transaction = JSON.parse(transaction)
    // TODO: compare tx
  }
}
