const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const async = require('async')
const UserModel = require('./mongoose/models/UserModel')

router.use(cors())
router.use(express.static('public'))
router.use(express.static(__dirname + '/view/dist'))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'view/dist/index.html')) })

router.post('/sign-in', (req, res) => {
    async.waterfall([
        cb => {
            UserModel.findOne({ username: req.body.username }, (err, user) => {
                cb(err, user)
            })
        },

        (user, cb) => {
            if(user == null) return res.json(false)
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(result == false) return res.json(false)
                cb(err, user)
            })
        }
    ], (err, result) => {
        if(err) throw err
        
        result = result.toObject()
        delete result.username
        delete result.password

        res.json(result)
    })
})

router.get('/clients/:except', (req, res) => {
    c = [...clients]
    c.splice(c.findIndex(v => v.sId == req.params.except, 1))
    res.json(c)
})

module.exports = router