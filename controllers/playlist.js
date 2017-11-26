'use strict'

let path = require('path')
let fs = require('fs')
let mongoosePaginate = require('mongoose-pagination')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')
let Playlist = require('../models/playlist')

function getPlaylist(req, res){
  let playlistId = req.params.id

  Playlist.findById(playlistId).populate({path: 'user'}).exec( (err, playlist) => {
    if(err){
      res.status(500).send({message: 'Error request'})
    }else{
      if(!playlist){
        res.status(404).send({message: 'Playlist not exist'})
      }else{
        res.status(200).send({playlist})
      }
    }
  })
}

function getPlaylists(req, res){
  let userId = req.params.user
  let find = null

  if (!userId) {
    find = Playlist.find({}).sort('title')
  }else{
    find = Playlist.find({user: userId}).sort('date')
  }

  find.populate({path: 'user'}).exec( (err, playlists) => {
    if (err) {
      res.status(500).send({message: 'Server error'})
    }else{
      if(!playlists){
        res.status(404).send({message: 'playlists not saved'})
      }else{
        res.status(200).send({playlists})
      }
    }
  })
}

function savePlaylist(req, res){
  let playlist =  new Playlist()
  let params = req.body
  playlist.name = params.name
  playlist.user = params.user

  playlist.save( (err, playlistStored) => {
    if(err){
      res.status(500).send({message: 'Server error'})
    }else{
      if(!playlistStored){
        res.status(404).send({message: 'playlist not saved'})
      }else{
          res.status(200).send({playlist: playlistStored})
      }
    }
  })
}

function updatePlaylist(req, res){
  let playlistId = req.params.id
  let update = req.body

  Playlist.findByIdAndUpdate(playlistId, update, (err, playlistUpdated) => {
    if (err) {
      res.status(500).send({message: 'Server error'})
    }else{
      if(!playlistUpdated){
        res.status(404).send({message: 'playlist not exist'})
      }else{
        res.status(200).send({playlist: playlistUpdated})

      }
    }
  })
}

function deletePlaylist(req, res){
  let playlistId = req.params.id

  Playlist.findByIdAndRemove(playlistId, (err, playlistRemoved) => {
    if(err){
      res.status(500).send({message: 'Error playlist'})
    }else{
      if(!playlistRemoved){
        res.status(404).send({message: 'playlist not removed'})
      }else{
        Song.findAndUpdate({pull: {playlist: playlistRemoved._id}}, (err, songRemoved) => {
          if(err){
            res.status(500).send({message: 'Error song'})
          }else{
            if(!songRemoved){
              res.status(404).send({message: 'song not removed'})
            }else{
              res.status(200).send({album: playlistRemoved})
            }
          }
        })
      }
    }
  })
}

module.exports = {
  getPlaylist,
  getPlaylists,
  savePlaylist,
  updatePlaylist,
  deletePlaylist
}
