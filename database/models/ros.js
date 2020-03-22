import mongoose from 'mongoose';
import config from 'config';

const { Schema } = mongoose;

const rosSchema = new mongoose.Schema({
  connection_name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  pub_data: [
    {
      type: Schema.Types.ObjectId,
      ref: config.get('mongodb_collections.pub'),
      required: true,
    },
  ],
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.ros'), rosSchema);
