
  const dotenv = require('dotenv');
  dotenv.config();
  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const methodOverride = require('method-override');
  const userController = require('./controllers/userController');
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  const isSignedIn = require('./middleware/is-signed-in');
  const passUserToView = require('./middleware/pass-user-to-view');

  const port = process.env.PORT ? process.env.PORT : "3000"

  // DATABASE CONNECTION
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on('connected',() => {
    console.log(`connected to MongoDB: ${mongoose.connection.name}`);
  });

 

  // MIDDLEWARE
  app.use(express.urlencoded({extended: false}));
  app.use(methodOverride('_method'));
  app.use(morgan('dev'));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  }));
  
  app.use(passUserToView);

  app.get('/', (req,res) => {
    res.render('index.ejs',{
      title: "App"
    });
  });

  // ROUTES
  app.use('/auth',userController);

  app.get('/vip-lounge', isSignedIn,(req,res) => {
    res.send(`Welcome ${req.session.user.username}`)
  });

  app.listen(port,console.log('server is connected!: ' + port));