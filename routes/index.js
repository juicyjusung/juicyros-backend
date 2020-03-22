import httpStatus from 'http-status-codes';
import rosService from '../services/rosService';
import logger from '../logging/logger';
import User from '../database/models/user';
import Pub from '../database/models/pub';
import Ros from '../database/models/ros';

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/test', async (req, res, next) => {
  let response;
  try {
    response = await testService(req.body, req.user);
    return res.status(response.httpStatus).send(response);
  } catch (e) {
    logger.error('Error in editRos Controller', { meta: e });
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
  }
});

const testService = async (rosObj, userObj) => {
  let result = {};
  try {
    const user = await User.findOne({ email: userObj.email }).exec();
    if (!user) {
      result = {
        httpStatus: httpStatus.UNAUTHORIZED,
        status: 'failed',
        errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
      };
      return result;
    }
    const pub = await Pub.find();
    const resonseData = pub;
    result = resonseData
      ? { httpStatus: httpStatus.OK, status: 'successful', responseData: resonseData }
      : {
          httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
        };
    return result;
  } catch (e) {
    logger.error('Error in Test Service', { meta: e });
    result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
    return result;
  }
};

module.exports = router;
