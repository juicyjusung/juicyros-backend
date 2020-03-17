import httpStatus from 'http-status-codes';
import rosService from '../services/rosService';
import logger from '../logging/logger';

export default {
  /*
  async name(req, res, next) {
    let response;
    try {
      response = await rosService.servicename(req.body.connectionName, req.body.url, req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in createRos Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },
  */

  async createRos(req, res, next) {
    let response;
    try {
      response = await rosService.createRos(req.body.connectionName, req.body.url, req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in createRos Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },

  async getRos(req, res, next) {
    let response;
    try {
      response = await rosService.getRos(req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in rosService Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },

  async removeRos(req, res, next) {
    let response;
    try {
      const { _id } = req.body;
      response = await rosService.removeRos(_id, req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in deleteRos Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },

  async addPub(req, res, next) {
    let response;
    try {
      response = await rosService.addPub(req.body, req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in addPub Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },

  async editRos(req, res, next) {
    let response;
    try {
      response = await rosService.editRos(req.body.ros, req.user);
      return res.status(response.httpStatus).send(response);
    } catch (e) {
      logger.error('Error in editRos Controller', { meta: e });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: e });
    }
  },
};
