const express = require("express")
const bodyParser = require("body-parser")
const CONFIG = require("./config/config")
const connectMongoDb = require("./db/mongodb")
const unknownEndpoint = require("./unknownEndpoint")
const {requestLogger} = require("./logging/logger")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")

//Routes
const articleRouter = require("./routes/articles")
const signUpRouter = require("./routes/signUp")
const loginRouter = require("./routes/login")

const app = express()

//Connect to MongoDb Database
connectMongoDb()

//Add Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/v1/articles", articleRouter)
app.use("/api/v1/signUp", signUpRouter)
app.use("/api/v1/login", loginRouter)

app.get ("/", (req, res) => {
    res.send("Welcome to BlogIt")
})

// use request logger
app.use(requestLogger)

//Add rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

//Security Middleware
app.use(helmet())

// use middleware for unknown endpoints
app.use(unknownEndpoint)

//Error Handler Middleware
app.use((err, req, res, next) => {
    console.log(err)
    const errorStatus = err.status || 500
    res.status(errorStatus).send(err.message)
    next()
})

app.listen(CONFIG.PORT, () => {
    console.log(`Server started on http://localhost:${CONFIG.PORT}`)
})