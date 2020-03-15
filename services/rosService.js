import httpStatus from 'http-status-codes';
import logger from '../logging/logger';
import UserRos from '../database/models/userros';
import Ros from '../database/models/ros';
import User from '../database/models/user';
import Pub from '../database/models/pub';

export default {
  /*
  async createRos(connectionName, url, userObj) {
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
      const ros = new Ros({
        connection_name: connectionName,
        url,
      });
      let ross = new Ross({
        user,
        ros: [ros],
      });
      ross = await ros.save();
      result = ros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: ros }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createRos Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },
   */
  async createRos(connectionName, url, userObj) {
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
      let ros = new Ros({
        connection_name: connectionName,
        url,
      });
      ros = await ros.save();

      let userros = await UserRos.findOne({ user }).exec();
      if (!userros) {
        userros = new UserRos({
          user,
          ros: [ros],
        });
        userros = await userros.save();
      } else {
        userros.ros.push(ros);
        userros = await userros.save();
      }

      const createdRos = Ros.findOne({ ros }).exec();
      console.log('createdRos: ', createdRos);

      result = createdRos
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: createdRos }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createRos Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },

  async getRos(userObj) {
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

      const userros = await UserRos.findOne({ user }).populate({ path: 'ros' });

      result = userros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: userros }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in getRos Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },

  async editRos(rosObj, userObj) {
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

      // eslint-disable-next-line no-underscore-dangle
      // const ros = Ros.findById(rosObj._id);
      // if (!ros) {
      //   result = {
      //     httpStatus: httpStatus.UNAUTHORIZED,
      //     status: 'failed',
      //     errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
      //   };
      //   return result;
      // }
      // eslint-disable-next-line no-underscore-dangle
      const ros = Ros.findByIdAndUpdate(rosObj._id, { connection_name: rosObj.connectionName, url: rosObj.url });
      if (!ros) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }
      ros.save();
      console.log(ros);

      result = ros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: ros }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createRos Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },

  async addPub(pubObj, rosid, userObj) {
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
      const ros = Ros.findById(rosid).exec();
      if (!ros) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }
      const pub = new Pub({
        pub_name: pubObj.pubName,
        topic_name: pubObj.topicName,
        message_type: pubObj.msgType,
        message: pubObj.msg,
      });

      ros.pub_data.push(pub);
      ros.save();

      result = ros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: ros }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createRos Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },
};
