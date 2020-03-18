import mongoose from 'mongoose';
import config from 'config';
import pubSchema from '../schemas/pub';

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
  pub_data: [pubSchema],
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.ros'), rosSchema);
