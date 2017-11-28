'use strict'

let express = require('express')
let SongController = require('../controllers/song')
let Searchsongs = require('../controllers/search')
let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/songs'})

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong)
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs)
api.get('/playlist-songs/:playlist?', md_auth.ensureAuth, SongController.getSongsPlaylist)
api.get('/get-song-file/:songFile', SongController.getSongFile)
api.get('/nextsong/:album/:number', md_auth.ensureAuth, SongController.getNextSong)
api.get('/searchsongs/:songText', md_auth.ensureAuth, Searchsongs.getSongs)
api.post('/song', md_auth.ensureAuth, SongController.saveSong)
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile)
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong)
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong)


module.exports = api
