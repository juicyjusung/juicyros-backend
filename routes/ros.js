import express from 'express';
import passport from 'passport';
import rosController from '../controllers/rosController';
import passportAuth from '../authentication/passportAuth';

const router = express.Router();

router.use(passportAuth.isAuthenticated);

router.route('/').get(rosController.getRos);
router.route('/createRos').post(rosController.createRos);
router.route('/removeRos').delete(rosController.removeRos);

router.route('/addPub').post(rosController.addPub);
router.route('/editPub').put(rosController.editPub);
router.route('/removePub').delete(rosController.removePub);

module.exports = router;
