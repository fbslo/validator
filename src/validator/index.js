const { hive, ethereum } = require("../blockchain/index.js")
const { transactionDatabase } = require("../dataAccess/index.js")
const { buildMakeValidateConversionRequest } = require("./validateConversionRequest.js")


const makeValidateConversionRequest = buildMakeValidateConversionRequest({ hive, ethereum, transactionDatabase })

module.exports.validator = makeValidateConversionRequest
