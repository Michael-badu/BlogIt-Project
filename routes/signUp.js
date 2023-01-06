const signUpRouter = require('express').Router()
const { createUser } = require('../controllers/signUp')

signUpRouter.route('/').post(createUser)

module.exports = signUpRouter