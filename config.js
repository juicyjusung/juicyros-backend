// Configuration and environment module imports
import dotenv from 'dotenv';
import fs from 'fs';

// Load the .env file from the system location where it is stored
if (process.env.NODE_ENV === 'development') {
  const envConfig = dotenv.parse(fs.readFileSync('.env.development'));
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
