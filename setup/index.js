require('dotenv').config();
const defaults = require("./defaults.js")
const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  })

const makeDatabase = async () => {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(process.env.DATABASE_NAME)
}

var collections = ['status', 'transactions', 'users', 'validators']

async function start(){
  let db = await makeDatabase()
  let num = 0
  for (i in collections){
    db.createCollection(collections[i], function(err, res) {
      if (err) {
        console.log(`Error:`, err.message);
        if (num == collections.length - 1) addPeers()
        num++
      }
      else {
        console.log(`Collection ${collections[i]} created!`);
        if (num == collections.length - 1) addPeers()
        num++
      }
    });
  }
}

async function addPeers(){
  let db = await makeDatabase()
  let defaultPeers = defaults.defaultPeers
  for (i in defaultPeers){
    let store = await db.collection("validators").insertOne({
      username: defaultPeers[i].username,
      address: defaultPeers[i].address
    })
    console.log(store)
  }
}

start()
