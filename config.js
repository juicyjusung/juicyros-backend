// Configuration and environment module imports
import dotenv from 'dotenv';
import fs from 'fs';

// Set environment variables
if (process.env.NODE_ENV === 'production') {
  // Load the .env file from the system location where it is stored
  const envConfig = dotenv.parse(fs.readFileSync('.env.production'));
  for (let k in envConfig) {
    process.env[k] = envConfig[k]
  }
  // for (const k in envConfig) {
  //   process.env[k] = envConfig[k];
  // }
} else {
  // Load the .env file from the system location where it is stored
  const envConfig = dotenv.parse(fs.readFileSync('.env.development'));
  for (let k in envConfig) {
    process.env[k] = envConfig[k]
  }
}
