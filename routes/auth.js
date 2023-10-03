const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const authControl = require('../controllers/auth');
const {storeReturnTo} = require('../middleware');

router.route('/register')
    .get(authControl.renderRegisterForm)
    .post(catchAsync(authControl.signUp));

router.route('/login')
    .get(authControl.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
    authControl.login);

router.get('/logout', authControl.logout); 

module.exports = router;