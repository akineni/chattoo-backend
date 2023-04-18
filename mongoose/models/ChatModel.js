const ChatSchema = require('../schemas/ChatSchema')

module.exports = require('mongoose').model('Chat', ChatSchema)