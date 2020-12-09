const { MongoClient } = require('mongodb');
const { makeValidatorsDatabase } = require("./validators.js")

const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useNewUrlParser: true })

module.exports.makeDatabase = () => {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(process.env.DATABASE_NAME)
}

const validatorDatabase = makeValidatorsDatabase({ makeDatabase })
module.exports.validatorDatabase = validatorDatabase
