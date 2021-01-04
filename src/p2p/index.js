const { hive } = require("../blockchain/index.js")
const { validatorDatabase } = require("../dataAccess/index.js")
const { p2pEventsHandler } = require("../eventHandler/p2pEvents/eventRouter.js")

const { makeP2P } = require("./makeP2P.js")

module.exports.p2p = makeP2P({ hive, validatorDatabase, p2pEventsHandler })
