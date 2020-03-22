import httpStatus from 'http-status-codes';
import logger from '../logging/logger';
import UserRos from '../database/models/userros';
import Ros from '../database/models/ros';
import User from '../database/models/user';
import Pub from '../database/models/pub';

export default {
  async createRos(connectionName, url, userObj) {
    let result = {};
    try {
      const user = await User.findOne({ email: userObj.email });
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

      let userros = await UserRos.findOne({ user });
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
      const createdRos = await Ros.findOne({ _id: ros._id });

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

      const userros = await UserRos.findOne({ user }).populate({ path: 'ros', populate: { path: 'pub_data' } });
      console.log('userros: ', userros);

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

  async removeRos(_id, userObj) {
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
      await Ros.findByIdAndDelete({ _id }).exec();
      // TODO: 해당ROS에 등록된 childred 데이터 삭제 로직 필요 - 2020-03-18, 오전 1:36
      const userros = await UserRos.findOne({ user }).populate({ path: 'ros', populate: { path: 'pub_data' } });
      result = userros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData: userros }
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
      const ros = Ros.findByIdAndUpdate(rosObj._id, { connection_name: rosObj.connectionName, url: rosObj.url });
      if (!ros) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }

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

  async addPub(pubItem, rosObj, userObj) {
    let result = {};
    try {
      const user = await User.findOne({ email: userObj.email });
      if (!user) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }
      const ros = await Ros.findById({ _id: rosObj._id });
      if (!ros) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }
      const pub = new Pub({
        pub_name: pubItem.pub_name,
        topic_name: pubItem.topic_name,
        message_type: pubItem.message_type,
        message: pubItem.message,
      });

      await pub.save();
      ros.pub_data.push(pub);
      await ros.save();

      const responseData = await Ros.findById({ _id: rosObj._id }).populate({ path: 'pub_data' });
      result = responseData
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createPub Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },

  async editPub(pubItem, rosObj, userObj) {
    let result = {};
    try {
      const user = await User.findOne({ email: userObj.email });
      if (!user) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }

      await Pub.findByIdAndUpdate(pubItem._id, {
        pub_name: pubItem.pub_name,
        topic_name: pubItem.topic_name,
        message_type: pubItem.message_type,
        message: pubItem.message,
      });

      const responseData = await Ros.findById({ _id: rosObj._id }).populate({ path: 'pub_data' });
      if (!responseData) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }

      result = responseData
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in createPub Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },

  async removePub(pubItem, rosObj, userObj) {
    let result = {};
    try {
      const user = await User.findOne({ email: userObj.email });
      if (!user) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }

      const ros = await Ros.findById({ _id: rosObj._id });
      if (!ros) {
        result = {
          httpStatus: httpStatus.UNAUTHORIZED,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        };
        return result;
      }

      await ros.pub_data.pull(pubItem._id);
      await ros.save();
      await Pub.findById({ _id: pubItem._id }).remove();

      const responseData = await Ros.findById({ _id: rosObj._id }).populate({ path: 'pub_data' });

      result = ros
        ? { httpStatus: httpStatus.OK, status: 'successful', responseData }
        : {
            httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
          };
      return result;
    } catch (e) {
      logger.error('Error in removePub Service', { meta: e });
      result = { httpStatus: httpStatus.BAD_REQUEST, status: 'failed', errorDetails: e };
      return result;
    }
  },
};
