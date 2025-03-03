const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const UserModel = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age skills about'; // safe data to be sent to the client

// get all the pending connection requests for the loggedInUser
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);

    res.status(200).json({
      message: 'Requests fetched successfully',
      data: requests,
    });
  } catch (error) {
    res.status(500).send('something went wrong' + error);
  }
});

// get all the connections for loggedInUser
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser?._id, status: 'accepted' },
        { toUserId: loggedInUser?._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: 'Connections fetched successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).send('something went wrong' + error);
  }
});

// user feed API
userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeedSet = new Set();
    requests.forEach((row) => {
      hideUsersFromFeedSet.add(row.fromUserId.toString());
      hideUsersFromFeedSet.add(row.toUserId.toString());
    });

    hideUsersFromFeedSet.add(loggedInUser?._id.toString());

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeedSet) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.status(200).json({
      message: 'Feed fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).send('something went wrong' + error);
  }
});

module.exports = userRouter;
