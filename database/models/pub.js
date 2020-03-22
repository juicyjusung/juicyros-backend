import mongoose from 'mongoose';
import config from 'config';

const pubSchema = new mongoose.Schema({
  pub_name: {
    type: String,
    required: true,
  },
  topic_name: {
    type: String,
    required: true,
  },
  message_type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.pub'), pubSchema);
