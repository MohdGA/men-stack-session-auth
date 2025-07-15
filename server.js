
  const dotenv = require('dotenv');
  dotenv.config();
  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const methodOverride = require('method-override');

  const port = process.env.PORT ? process.env.PORT : "3000"

  // DATABASE CONNECTION
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on('connected',() => {
    console.log(`connected to MongoDB: ${mongoose.connection.name}`);
  })

  // MIDDLEWARE
  app.use(express.urlencoded({extended: false}));
  app.use(methodOverride('_method'));
  app.use(morgan('dev'))


  app.get('/', (req,res) => {
    res.render('index.ejs',{
      title: "App"
    })
  })

  app.listen(port,console.log('server is connected!: ' + port));