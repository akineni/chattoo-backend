const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE}`).then(() => {
    console.log(`Connected to database: "${process.env.DATABASE}"`)
})