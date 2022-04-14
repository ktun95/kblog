const express = require('express')
const router = express.Router()
const { mongoClient, ObjectID } = require('../db')

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
        const findResult = posts.find({}, {fields: {images: false}})
        const allPosts = await findResult.toArray()
        console.log(allPosts)
        res.json(allPosts)
    } catch (err) {
        next(err)
    }
})

router.get('/drafts', async (req, res, next) => {
    try {
        const query = {$or: [
                        { published: {$exists: false} },
                        { published: {$eq: false } }
                    ]
                }   

        const posts =  await req.db.collection('posts')
        const findResult = posts.find(query, {fields: {images: false} })
        const allDrafts = await findResult.toArray()
        console.log(allDrafts)
        res.json(allDrafts)
    } catch (err) {
        next(err)
    }
})

router.get('/country/:countryCode', async (req, res, next) => {
    try {
        const posts = await req.db.collection( )
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const posts = await req.db.collection('posts')
        const singlePost = await posts.findOne({"_id": ObjectID(id)})
        res.json(singlePost)
    } catch (err) {
        next(err)
    }
})

//fix this
router.post('/', async (req, res, next) => {
    if (!!req.user) req.status(401).send('Unauthorized request') 
    
    console.dir(req.body)

    //maybe put in some real validation at some point...
    const newEntry = {
        title: req.body.title || 'untitled',
        coordinates: req.body.coordinates || null,
        publishDate: req.body.publishDate || null,
        postContents: req.body.postContents || '',
        images: req.body.images || []
    }

    try {
        const db = mongoClient.db("tintin")
        const postsCollection = db.collection('posts')
        const newPost = await postsCollection.insertOne(newEntry)
        console.log(`${newPost.insertedCount} documents were inserted with the _id: ${newPost.insertedId}`)
        res.send(newPost)   
    } catch (err) {
        next(err)
    }
})

router.post('/:id/images', async (req, res, next) => {
    if (!!req.user) req.status(401).send('Unauthorized request')
    const postId = req.params.id
    try {
        
    } catch (err) {
        next(err)
    }
})

router.put('/:id', async (req, res, next) => {
    if (!!req.user) req.status(401).send('Unauthorized request') 
    const postId = req.params.id

    const newEntry = {
        title: req.body.title || 'untitled',
        coordinates: req.body.coordinates || null,
        publishDate: req.body.publishDate || null,
        postContents: req.body.postContents || [],
        images: req.body.images || []
    }

    try {
        const db = mongoClient.db("tintin")
        const postsCollection = db.collection('posts')
        const updatedPost = await postsCollection.updateOne({"_id": ObjectID(postId)}, {$set: newEntry})
        res.send(updatedPost)   
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    if (!!req.user) req.status(401).send('Unauthorized request') 
    const postId = req.params.id

    try {
        const db = mongoClient.db("tintin")
        const postsCollection = db.collection('posts')
        const deletedPost = await postsCollection.deleteOne({"_id": ObjectID(postId)})
        res.status(deletedPost)
    } catch (err) {
        next(err)
    }
})

// router.use((req, res, next) => {
//     Client.close()
// })

module.exports = router;