const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt')

router.get('/sign-up',(req,res) => {
  // const allUsers = await User.create(req.body);
  res.render('auth/sign-up.ejs')
});

// POST A NEW USER TO THE DATABASE WHEN THE FORM IS SUBMITTED
router.post('/sign-up', async (req,res) => {

 // get data form from req.body
 // check if someone already exists

  const userInDatabase = await User.findOne({username: req.body.username});

  if(userInDatabase){
    return res.send("Username already taken ):");
  };
  // check that password and confirm password are the same
  if(req.body.password !== req.body.confirmPassword){
    return res.send('Passowrd and confirm password must match!');
  };
  // check for passowrd complexity (LEVEL UP)
  // hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password,10);
  req.body.password = hashedPassword;

  const newUser = await User.create(req.body);

  req.session.user = {
    username: newUser.username,
    _id: newUser._id
  };

  req.session.save(() => {
    res.redirect('/')
  });

  res.send(`Thanks for signing Up ${newUser.username}`);
});

router.get('/sign-in',(req,res) => {
  res.render('auth/sign-in.ejs')
});

router.post('/sign-in', async (req,res) => {

  const userInDatabase = await User.findOne({username: req.body.username});
  console.log('username: ' + userInDatabase);

  // if username in the database is not exist
  if(!userInDatabase){
    return res.send("Login failed, try again ):");
  };

  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);

  if(!validPassword){
    return res.send('Password failed. Please try again!');
  };

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  req.session.save(() => {
    res.redirect('/')
  });
  
});

router.get('/sign-out', (req,res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
  
});

module.exports = router;