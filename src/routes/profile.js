const express = require('express');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth ');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();

// Profile API
profileRouter.get('/profile/view', async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      throw new Error('No token found');
    }

    // validate my token
    const decodedMessage = jwt.verify(token, 'secret');
    const { _id } = decodedMessage;
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send('get profile error' + error);
  }
});

// Update profile
profileRouter.patch('/profile/update', userAuth, async (req, res) => {
  try {
    const isValidUserData = validateEditProfileData(req);
    if (!isValidUserData) {
      throw new Error('Invalid req data');
    }

    const loggedInUser = req.user;
    const user = await UserModel.findByIdAndUpdate(
      loggedInUser?._id,
      req.body,
      {
        new: true,
        returnDocument: 'after',
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).json({
        message: 'Profile updated successfully',
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send('something went wrong:' + error);
  }
});

// Change password API
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    // validate the old password
    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).send('Invalid old password');
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update the password
    const user = await UserModel.findByIdAndUpdate(
      loggedInUser?._id,
      { password: hashedPassword },
      {
        new: true,
        returnDocument: 'after',
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).json({
        message: 'Password updated successfully',
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send('something went wrong:' + error);
  }
});

module.exports = profileRouter;
