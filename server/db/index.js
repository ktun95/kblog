const MongoClient = require('mongodb').MongoClient;
const username = encodeURIComponent("kevin_tun")
const password = encodeURIComponent("1234pork")
const database = encodeURIComponent("tintin")
const clusterURL = encodeURIComponent()
const uri = `mongodb+srv://${username}:${password}@cluster0.1cts9.mongodb.net/${database}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  console.log(`Connecting to MongoDB database ${database}...`)
  try {
    await client.connect()
    // const db = await client.db(database)
    // const posts = await db.collection('posts')
    // console.log(posts)
    console.log("Connected successfully to database")
    // return db
  } catch (err) {
    console.dir(err, "Did you update the whitelist?")
    await client.close();
  // } finally {
  //   console.log("Closing connection to MongoDB database")
  //   await client.close();
  }
}

run()

module.exports = client; 

