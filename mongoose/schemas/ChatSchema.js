const mongoose = require('mongoose')
var Schema = mongoose.Schema

module.exports = new Schema({
    from: { type: Schema.Types.ObjectId, required: true },
    to: { type: Schema.Types.ObjectId, required: true },
    body: { type: String, required: true },
    time: {type: Date, default: Date.now }
})