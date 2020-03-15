import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';
// import ROLES_ARRAY from '../reference-data-files/roles';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: value => {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.user'), userSchema);
