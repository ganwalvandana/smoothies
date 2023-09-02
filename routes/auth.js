const express = require('express');
const authController = require('../controllers/auth');
const {isAuth} = require('../middleware/auth');

const router = express.Router();

router.get('/', authController.getHome );
router.get('/afterlogin',isAuth, authController.getAfterLogin );

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);


module.exports = router;