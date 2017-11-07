'use strict'

let mongoosePaginate = require('mongoose-pagination')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')

function getSongs(req, res){
  let songsText = req.params.songText

  Song.find({name: {'$regex' : songsText, '$options' : 'i'}}).populate({path: 'album'}).exec( (err, songs, total) => {
    if(err){
      res.status(500).send({message: 'Error request'})
    }else{
      if(!songs){
        res.status(404).send({message: 'Not have songs'})
      }else{
        res.status(200).send({
          songs: songs,
          totalSongs: total
        })
      }
    }
  })
}

function getArtists(req, res){
  let artistText = req.params.artistText

  Artist.find({name: {'$regex' : artistText, '$options' : 'i'}}).sort('name').exec((err, artists, total)=>{
    if(err){
      res.status(500).send({message: 'Error artists'})
    }else{
      if(!artists){
        res.status(404).send({message: 'Not have artist'})
      }else{
        return res.status(200).send({
          totalItems: total,
          artists: artists
        })
      }
    }
  })
}

function getAlbums(req, res){
  let albumsText = req.params.albumText

  Album.find({title: {'$regex' : albumsText, '$options' : 'i'}}).sort('title').exec((err, albums, total)=>{
    if(err){
      res.status(500).send({message: 'Error albuns'})
    }else{
      if(!albums){
        res.status(404).send({message: 'Not have albums'})
      }else{
        return res.status(200).send({
          totalItems: total,
          albums: albums
        })
      }
    }
  })
}

module.exports = {
  getSongs,
  getArtists,
  getAlbums
}
