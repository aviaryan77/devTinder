const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {
  authRouter,
  requestRouter,
  profileRouter,
  userRouter,
} = require('./routes');

// middleware to parse the incoming request body to JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', userRouter);

const port = 7777;
const UserModel = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');

// User API
app.get('/user', async (req, res) => {
  try {
    const users = await UserModel.findOne({ emailId: req.body?.emailId });
    // const users = await UserModel.find({ emailId: req.body?.emailId }) // this will return an array
    console.log('users', users);
    if (!users) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    res.status(400).send('something went wrong');
  }
});

// getConnectionRequest API
app.get('/getConnectionRequest', userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
});

// Feed API
app.get('/feed', async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (!users.length) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
});

// Delete User API
app.delete('/user', async (req, res) => {
  try {
    // const users = await UserModel.findOneAndDelete({ emailId: req.body?.emailId });
    const users = await UserModel.findByIdAndDelete(req.body?.userId);
    console.log('users', users);
    if (!users) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
});

// Update User Data API
app.patch(`/user/:userId`, async (req, res) => {
  try {
    const userId = req.params?.userId;
    const ALLOWED_UPDATES = [
      'firstName',
      'lastName',
      'age',
      'gender',
      'skills',
      'about',
      'photoUrl',
    ];

    const isUpdateAllowed = Object.keys(req.body).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send('Update not allowed for some fields');
    }

    if (req?.body?.skills && !Array.isArray(req?.body?.skills)) {
      return res.status(400).send('Skills should be an array');
    } else if (req?.body?.skills?.length > 10) {
      return res.status(400).send('Skills should not be more than 10');
    }

    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
      returnDocument: 'after',
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send('UPDATE FAILED: ' + error);
  }
});

// first connect to DB and then start the server
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`DevTinder listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Error while connecting to MongoDB', error);
  });

module.exports = {
  app,
};
