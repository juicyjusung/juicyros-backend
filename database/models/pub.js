import mongoose from 'mongoose';
import config from 'config';
import pubSchema from '../schemas/pub';

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.pub'), pubSchema);
