const { MongoClient } = require('mongodb');
const { makeValidatorsDatabase } = require("./validators.js")
const { makeUsersDatabase } = require("./users.js")

const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useNewUrlParser: true })

module.exports.makeDatabase = async () => {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(process.env.DATABASE_NAME)
}

const validatorDatabase = makeValidatorsDatabase({ makeValidatorsDatabase })
const userDatabase = makeUsersDatabase({ makeUsersDatabase })

module.exports.validatorDatabase = validatorDatabase
module.exports.userDatabase = userDatabase
