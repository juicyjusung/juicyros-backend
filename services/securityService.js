import config from 'config';
import httpStatus from 'http-status-codes';
import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';

import logger from '../logging/logger';

/**
 * This service performs security related tasks, like signup
 */
export default {
  async signup(userObj) {
    let result = {};
    try {
      let user = new User({
        email: userObj.email,
        password: cryptoGen.createPasswordHash(userObj.password),
        name: userObj.name,
      });

      user = await user.save();
      if (!user) {
        result = {
          httpStatus: httpStatus.BAD_REQUEST,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST),
        };
        return result;
      }

      // If we have gotten here, the request must be successful, so respond accordingly
      logger.info('A new user has signed up', { meta: user });
      // emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken);
      const responseObj = { email: user.email, name: user.name };
      result = { httpStatus: httpStatus.OK, status: 'successful', responseData: responseObj };
      return result;
    } catch (err) {
      logger.error('Error in signup Service', { meta: err });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: err };
      return result;
    }
  },
};
