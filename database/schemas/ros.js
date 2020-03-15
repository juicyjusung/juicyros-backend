import mongoose from 'mongoose';
import pubSchema from './pub';

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
module.exports = rosSchema;
