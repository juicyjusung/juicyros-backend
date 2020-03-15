import mongoose from 'mongoose';
import config from 'config';
import rosSchema from './ros';

const { Schema } = mongoose;

const rossSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: config.get('mongodb_collections.user'),
    required: true,
  },
  ros: [
    {
      type: Schema.Types.ObjectId,
      ref: config.get('mongodb_collections.ros'),
      required: true,
    },
  ],
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.userros'), rossSchema);
