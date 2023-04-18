const UserSchema = require('../schemas/UserSchema')

module.exports = require('mongoose').model('User', UserSchema)