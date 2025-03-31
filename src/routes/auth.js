const express = require('express');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const authRouter = express.Router();


// Sign up
authRouter.post('/signup', async (req, res) => {
  // validate the incoming data
  try {
    validateSignupData(req);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  // Encrypt the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: hashedPassword,
    // age: req.body.age,
    // gender: req.body.gender,
  };

  // creating a new instance of UserModel
  const user = new UserModel(userObj);

  // saving the user to the database
  try {
    const savedUser = await user.save();
    const { password, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).send(userWithoutPassword);
  } catch (error) {
    console.log('error', error);
    res.status(400).send('SIGNUP FAILED: ' + error);
  }
});


// Sign in
authRouter.post('/signin', async (req, res) => {
  try {
    const user = await UserModel.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(404).send('Invalid Credentials');
    }

    const isPasswordValid = await user.validatePassword(req.body.password);
    if(isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
      res.json({
        message: 'Login Successful',
        user: user,
        token,

      })
    } else {
      return res.status(401).send('Invalid Credentials');
    }
  } catch (error) {
    res.status(400).send('something went wrong' + error);
  }
});

// logout 
authRouter.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.cookie('token', null);
  res.send('Logged out');
});

module.exports = authRouter;