'use strict'

let express = require('express')
let SongController = require('../controllers/song')
let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/songs'})

api.post('/song', md_auth.ensureAuth, SongController.saveSong)
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong)
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs)
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong)
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong)
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile)
api.get('/get-song-file/:songFile', SongController.getSongFile)


module.exports = api
