const { hive } = require("../blockchain/index.js")
const { validatorDatabase } = require("../dataAccess/index.js")
const { eventEmitter } = require("../eventHandler/index.js")

const { makeP2P } = require("./makeP2P.js")

module.exports.p2p = makeP2P({ hive, validatorDatabase, eventEmitter })
