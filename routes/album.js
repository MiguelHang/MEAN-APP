'use strict'

let express = require('express')
let AlbumController = require('../controllers/album')
let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/artists'})

api.get('/album', md_auth.ensureAuth, AlbumController.getAlbum)
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum)

module.exports = api
