const { MongoClient } = require('mongodb');
const { makeValidatorsDatabase } = require("./validators.js")
const { makeUsersDatabase } = require("./users.js")
const { makeStatusDatabase } = require("./status.js")

const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  })

const makeDatabase = async () => {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(process.env.DATABASE_NAME)
}

const validatorDatabase = makeValidatorsDatabase({ makeDatabase })
const userDatabase = makeUsersDatabase({ makeDatabase })
const statusDatabase = makeStatusDatabase({ makeDatabase })

module.exports.validatorDatabase = validatorDatabase
module.exports.userDatabase = userDatabase
module.exports.statusDatabase = statusDatabase
