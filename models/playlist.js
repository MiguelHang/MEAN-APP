'use strict'
const mongoose = require('mongoose')
let Schema = mongoose.Schema

let PlaylistSchema = Schema({
  name: String,
  user: {type: Schema.ObjectId, ref: 'User'},
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Playlist', PlaylistSchema)
