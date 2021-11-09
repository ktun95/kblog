if (process.env.NODE_ENV = 'development') {
    console.log('Using local environmental variables')
    const dotenv = require('dotenv')
    dotenv.config()
}

module.exports = {
    port: process.env.PORT,
    sessionSecret: process.env.SESSION_SECRET,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    salt: process.env.SALT
}