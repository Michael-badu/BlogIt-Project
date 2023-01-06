const loginRouter = require('express').Router()
const { loginUser } = require('../controllers/login')

loginRouter.route('/').post(loginUser)

module.exports = loginRouter