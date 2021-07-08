const express = require('express')
const path = require('path')
const app = express()
const dbClient = require('./db')
const PORT = 3030
const morgan = require('morgan')
const addRequestId = require('express-request-id')({setHeader: false})

morgan.token('id', (req) => req.id.split('-')[0])

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '..', '/public')))

app.use(addRequestId)

app.use(morgan("[:date[iso] #:id] Started :method :url for :remote-addr", {immediate: true}))

app.use(morgan("[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms"))

app.use('/api', require("./api"))

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
})

// const startServer = () => {
//     try {
//         dbClient.connect((err) => {
//             console.log('Connecting to MongoDB server...')
//             app.listen(PORT, () => {
//                 console.log(`Starting server on port ${PORT}`)
//             })
//         })
//     } catch (err) {
//         console.dir(err)
//     }
// }

// startServer()
const server = app.listen(PORT, () => {
    console.log(`Starting server on port ${PORT}`)
})