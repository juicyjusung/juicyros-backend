import mongoose from 'mongoose';

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
module.exports = pubSchema;
