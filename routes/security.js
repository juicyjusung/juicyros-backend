import express from 'express';
import passport from 'passport';
import { check, sanitize, validationResult } from 'express-validator';
import securityController from '../controllers/securityController';

const router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Veniqa Security' });
});
router.route('/signup').post(securityController.signup);

router.route('/login').post(passport.authenticate('login'), securityController.login);

router.get('/isLoggedIn', (req, res, next) => {
  return res.status(200).send(req.isAuthenticated());
});

router.route('/logout').get(securityController.logout);

// router.route('/forgotPassword').get(securityController.forgotPassword);
//
// router.route('/validatePasswordResetToken/:token').get(securityController.validatePasswordResetToken);
//
// router.route('/resetPassword').post(securityController.resetPassword);

module.exports = router;
