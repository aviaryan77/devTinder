const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://aviaryan77:FJLbt3IDoKigKLPQ@staging.zwbcu.mongodb.net/?retryWrites=true&w=majority&appName=staging');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://aviaryan77:FJLbt3IDoKigKLPQ@staging.zwbcu.mongodb.net/devTinder');
    console.log('MongoDB is connected');
  } catch (error) {
    console.log(
      'Error while connecting to MongoDB',
      error
    );
  }
}

module.exports = connectDB;

