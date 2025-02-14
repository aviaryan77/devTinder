const express = require('express');
const { userAuth } = require('../middlewares/auth ');
const ConnectionRequest = require('../models/connectionRequest');
const UserModel = require('../models/user');

const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user?._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status; // ignore, interested, rejected, accepted

      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type: ' + status,
        });
      }

      // check if the user exists in the database
      const userExists = await UserModel.findOne({ _id: toUserId });
      if (!userExists) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // Check if the request is already sent
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: 'Connection request already exists',
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).json({
        message: 'Request sent successfully',
        data,
      });
    } catch (error) {
      res.status(500).send('something went wrong' + error);
    }
  }
);

// review connectionRequest API
requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user?._id;
      const requestId = req.params.requestId;
      const status = req.params.status; // rejected, accepted

      const allowedStatus = ['rejected', 'accepted'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type: ' + status,
        });
      }

      // check if the requestId exists
      const userExists = await UserModel.findOne({ _id: requestId });
      if (!userExists) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // check if the request exists
    } catch (error) {
      res.status(500).send('something went wrong' + error);
    }
  }
);

module.exports = requestRouter;
