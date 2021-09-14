const { MongoClient } = require('mongodb')
const username = encodeURIComponent("kevin_tun")
const password = encodeURIComponent("1234pork")
const database = encodeURIComponent("tintin")
const clusterURL = encodeURIComponent()
const uri = `mongodb+srv://${username}:${password}@cluster0.1cts9.mongodb.net/${database}?retryWrites=true&w=majority`;


const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const mongoClientConnect = async () => {
//   try {
//     const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     const connection = await mongoClient.connect()
//     return connection
//   } catch (err) {
//     console.log(err)
//     throw new Error('Connection to database failed.')
//   }
// }

// const mongoConnect = async () => {
//   try {
//     console.log('Creating MongoClient instance...')
//     client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
//     console.log('Establishing connection to MongoDB...')
//     connection = await client.connect()
//     console.log('Connection to MongoDB established!')

//     console.log('Connecting to database...')
//     db = client.db(database)
//     console.log('Successfully connected to database!')

//     return { client, connection, db }
//   } catch (err) {
//     console.log(err)
//     throw new Error('Connection to database failed.')
//   }
// }

// async function run() {
//   console.log(`Connecting to MongoDB database ${database}...`)
//   try {
//     await client.connect()
//     // const db = await client.db(database)
//     // const posts = await db.collection('posts')
//     // console.log(posts)
//     console.log("Connected successfully to database")
//     // return db
//   } catch (err) {
//     console.dir(err, "Did you update the whitelist?")
//     await client.close();
//   // } finally {
//   //   console.log("Closing connection to MongoDB database")
//     await client.close();
//   }
// }


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