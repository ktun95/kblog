const { MongoClient } = require('mongodb')
const username = encodeURIComponent(process.env.MONGO_USERNAME)
const password = encodeURIComponent(process.env.MONGO_PASSWORD)
const database = encodeURIComponent(process.env.MONGO_DATABASE)
const clusterURL = encodeURIComponent()
const uri = `mongodb+srv://${username}:${password}@cluster0.1cts9.mongodb.net/${database}?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectClient = () => { 
  try {
    let client;
    // const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    if (!mongoClient.isConnected()) {
      console.log(mongoClient.isConnected())
      client = mongoClient.connect()
      console.log('MongoClient connected!')
    } else {
      console.log('MongoClient already connected. Returning client...')
    }
    return client
  } catch (err) {
    console.log(err)
    throw new Error('Could not get database.')
  }
}

const getDb = async () => {
  try {
    const client = await getClient()
    return client.db(database)
  } catch (err) {
    console.log(err)
    throw new Error('Could not get database.')
  }
}
// run()

// resolveAndExport()

module.exports = {
  mongoClient,
  connectClient,
  getDb
}