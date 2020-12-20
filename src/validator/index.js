const { hive, ethereum } = require("../../blockchain/index.js")
const { buildMakeValidateConversionRequest } = require("./validateConversionRequest.js")

const makeValidateConversionRequest = buildMakeValidateConversionRequest({ hive, ethereum })
