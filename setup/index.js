require('dotenv').config();
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
  for (i in collections){
    db.createCollection(collections[i], function(err, res) {
      if (err) console.log(`Error:`, err.message);
      else console.log(`Collection ${collections[i]} created!`);
    });
  }
}

start()
