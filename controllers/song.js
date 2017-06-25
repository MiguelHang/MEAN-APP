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

module.exports = {
  saveSong,
  getSong
}
