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
 console.log(hashedPassword); 
 console.log(req.body);
 const newUser = await User.create(req.body);
  res.send(`Thanks for signing Up ${newUser.username}`);
})

module.exports = router;