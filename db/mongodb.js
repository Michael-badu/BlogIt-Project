const mongoose = require ("mongoose")
const CONFIG = require ("../config/config")
const logger = require ("../logging/logger")

function connectMongoDb() {
    mongoose.connect (CONFIG.MONGODB_URL)

    mongoose.connection.on("connected", () => {
        logger.info('connected to mongodb successfully')
    })

    mongoose.connection.on("error", (err)=>{
        logger.error(err)
    })
}

module.exports = connectMongoDb