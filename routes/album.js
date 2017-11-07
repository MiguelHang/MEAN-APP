'use strict'

let express = require('express')
let AlbumController = require('../controllers/album')
let Searchsongs = require('../controllers/search')
let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/albums'})

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum)
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums)
api.get('/searchalbums/:albumText', md_auth.ensureAuth, Searchsongs.getAlbums)
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum)
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum)
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum)
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage)
api.get('/get-image-album/:imageFile', AlbumController.getImageFile)

module.exports = api
