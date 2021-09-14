const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path')
const app = express()
const morgan = require('morgan')
const addRequestId = require('express-request-id')({setHeader: false})
const { mongoClient } = require('./db')
const PORT = 3030
// const SESSION_SECRET = process.env.NODE_ENV === 'development?' ? 'ICY_HOT' : process.env.SESSION_SECRET
const SESSION_SECRET = 'ICY_HOT'

function useMiddleware() {
    morgan.token('id', (req) => req.id.split('-')[0])
    
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    
    app.use(express.static(path.join(__dirname, '..', '/public')))
    
    app.use(addRequestId)
    
    app.use(morgan("[:date[iso] #:id] Started :method :url for :remote-addr", {immediate: true}))
    
    app.use(morgan("[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms"))
    
    app.use(
        session({
            store: MongoStore.create({ client: mongoClient.connect() }),
            secret: SESSION_SECRET,
            cookie: {
                maxAge: 60000
            },
            resave: false,
            saveUninitialized: false,
            logging: true
    }))

    //create db instance 
    app.use(async (req, res, next) => {
        if (!mongoClient.isConnected()) await mongoClient.connect()
        req.db = mongoClient.db()
        next()
    })
}

function useRoutes() {
    app.use('/auth', require ('./auth'))
    app.use('/api', require('./api'))
    app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })
}

function useErrorHandlers() {
    app.use((err, req, res, next) => {
        console.error(err)
        console.error(err.stack)
        res.status(err.status || 500).send(err.message || 'Internal server error.')
    })
}
const startServer = () => {
    try {
        useMiddleware()
        useRoutes()
        useErrorHandlers()
        app.listen(PORT, ()=> {
            console.log(`Starting server on port ${PORT}`)
        })
    } catch (err) {
        console.dir(err)
    }
}

startServer()
