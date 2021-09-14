const express = require('express')
const router = express.Router()
const { mongoClient } = require('../db')
// Client.connect()
//put connection check middleware here?
// MongoClient instance has an isConnected method 

// router.use((req, res, next)=> {
//     Client.connect()
//     next()
// }) 

// router.use((req, res, next) => {
//     try {
//         if (Client.isConnected()) {
//             next(req)
//         } else {
//             throw new Error('Not connected to database!')
//         }
//     } catch (err) {
//         next(err)
//     }
// })

router.get('/all', async (req, res, next) => {
    try {
        // const db = await getDb()
        const posts =  await req.db.collection('posts')
        const findResult = posts.find()
        const allPosts = await findResult.toArray()
        console.log(allPosts)
        res.json(allPosts)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const posts = await req.db.collection('posts')
        const findOneResult = await posts.findOne(id)
        
    } catch (err) {
        next(err)
    }
})

//fix this
router.post('/', async (req, res, next) => {
    if (!!req.user) req.status(401).send('Unauthorized request')
    const newDoc = req.body
    try {
        const db = Client.db("tintin")
        const postsCollection = db.collection('posts')
        const newPost = await postsCollection.insertOne(newDoc)
        console.log(`${newPost.insertedCount} documents were inserted with the _id: ${newPost.insertedId}`)
        res.send(newPost)
    } catch (err) {
        next(err)
    }
})

// router.use((req, res, next) => {
//     Client.close()
// })


module.exports = router;