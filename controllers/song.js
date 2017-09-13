'use strict'

let path = require('path')
let fs = require('fs')
let mongoosePaginate = require('mongoose-pagination')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')

function getSong(req, res){
  let songId = req.params.id

  Song.findById(songId).populate({path: 'album'}).exec( (err, song) => {
    if(err){
      res.status(500).send({message: 'Error request'})
    }else{
      if(!song){
        res.status(404).send({message: 'Album not exist'})
      }else{
        res.status(200).send({song})
      }
    }
  })
}

function getSongs(req, res){

  let albumId = req.params.album
  let find = null

  if(!albumId){
    find = Song.find({}).sort('number')
  }else{
    find = Song.find({album: albumId}).sort('number')
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec( (err, songs) =>{
    if(err){
      res.status(500).send({message: 'server error'})
    }else{
      if(!songs){
        res.status(404).send({message: 'not songs'})
      }else{
        res.status(200).send({songs})
      }
    }
  })
}

function saveSong(req,res){
  let song = new Song()

  let params = req.body
  song.number = params.number
  song.name = params.name
  song.duration = params.duration
  song.file = null
  song.album = params.album

  song.save( (err, songStored) => {
    if (err) {
      res.status(500).send({message: 'server error'})
    }else{
      if(!songStored){
        res.status(404).send({message: 'song not saved'})
      }else{
        res.status(200).send({song: songStored})
      }
    }
  })
}

function updateSong(req,res){
  let songId = req.params.id
  let update = req.body

  Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
    if (err) {
      res.status(500).send({message: 'server error'})
    }else{
      if(!songUpdated){
        res.status(404).send({message: 'song not updated'})
      }else{
        res.status(200).send({song: songUpdated})
      }
    }
  })
}

function deleteSong(req, res){
  let songId = req.params.id
  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if (err) {
      res.status(500).send({message: 'server error'})
    }else{
      if(!songRemoved){
        res.status(404).send({message: 'song not removed'})
      }else{
        res.status(200).send({song: songRemoved})
      }
    }
  })
}

function uploadFile(req, res){
  let songId = req.params.id
  let file_name = 'No upload...'

  if(req.files){
    let file_path = req.files.file.path
    let file_split = file_path.split('\/');
    file_name = file_split[2]

    let ext_split = file_name.split('\.')
    let file_ext = ext_split[1]

    if (file_ext == 'mp3' || file_ext == 'ogg') {
      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) =>{
        if(!songUpdated){
          res.status(404).send({message: 'song can not update'})
        }else{
          res.status(200).send({song: songUpdated})
        }
      })
    }else{
        res.status(200).send({message: 'file extension not valid'})
    }
  }else{
    res.status(200).send({message: 'file not upload'})
  }
}

function getSongFile(req, res){
  let songFile = req.params.songFile
  let path_file = './uploads/songs/'+songFile

  fs.exists(path_file, (exist) => {
    if(exist){
      res.sendFile(path.resolve(path_file))
    }else{
      res.status(200).send({message: 'file not exist'})
    }
  })
}

module.exports = {
  saveSong,
  getSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}
