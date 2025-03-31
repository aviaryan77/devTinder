const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    // validate my token
    const decodedObj = jwt.verify(token, 'secret');
    const { _id } = decodedObj;
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send('get profile error' + error);
  }
};

module.exports = {
  userAuth,
};
