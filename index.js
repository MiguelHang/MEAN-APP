'use strict'
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT || 3977

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/app-MEAN', (err, res) => {
  if(err){
    throw err
  }else{
    console.log('Conecting with database...')

    app.listen(port, function(){
      console.log('Server api rest listen in http://localhost:' + port)

    })
  }

});
