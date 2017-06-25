'use strict'

let express = require('express')
let SongController = require('../controllers/song')
let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/songs'})

api.post('/song', md_auth.ensureAuth, SongController.saveSong)
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong)

module.exports = api
