const express = require('express');
const connectDB = require('./config/database');
const app = express();

// middleware to parse the incoming request body to JSON
app.use(express.json());

const port = 7777;
const UserModel = require('./models/user');

app.post('/signup', async (req, res) => {
  console.log('req.body', req.body)
  const userObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
  };

  // creating a new instance of UserModel
  const user = new UserModel(userObj);

  // saving the user to the database
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
    console.log('savedUser', savedUser);
  } catch (error) {
    console.log('error', error)
    res.status(400).send('something went wrong');
  }
});

// User API
app.get('/user', async (req, res) => {
  try {
    const users = await UserModel.findOne({ emailId: req.body?.emailId })
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
    console.log('users', users)
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
app.patch('/user', async (req, res) => {
  try {
    const users = await UserModel.findByIdAndUpdate(req.body?.userId, req.body, { new: true, returnDocument: 'after' });
    if (!users) {
      return res.status(404).send('No user found');
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
}
);

// first connect to DB and then start the server
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Error while connecting to MongoDB', error);
  });

module.exports = {
  app,
};
