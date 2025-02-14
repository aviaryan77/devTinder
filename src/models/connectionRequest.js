const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignored', 'interested', 'rejected', 'accepted'],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre('save', async function (next) {
  const connectionRequest = this;
  // check if fromUserId and toUserId are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('You cannot send request to yourself');
  }

  // Check for existing connection request
  const existingRequest = await ConnectionRequest.findOne({
    fromUserId: connectionRequest.fromUserId,
    toUserId: connectionRequest.toUserId,
  });

  if (existingRequest && this.isNew) {
    throw new Error('Connection request already exists');
  }

  next();
});

connectionRequestSchema.index(
  {
    fromUserId: 1,
    toUserId: 1,
  },
  { unique: true }
);

const ConnectionRequest = mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);

module.exports = ConnectionRequest;
