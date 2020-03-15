import mongoose from 'mongoose';
import config from 'config';
import rosSchema from '../schemas/ros';

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.ros'), rosSchema);
