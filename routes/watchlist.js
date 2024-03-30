const router = require('express').Router();
// const watchlistController = require('../controllers/watchlist');
const favourites = require('../controllers/watchlist');
// router.post('/signup/:version', authController.signup);
// router.post('/signup', authController.signup);
// router.post('/signupasguest', authController.anonymousSignup);
// router.post('/signin', authController.signin);
// router.post('/changePassword', authController.changePassword)
// router.post('/updateUserProfile', authController.updateUserProfile)
// router.get('/getUserProfile', authController.getUserProfile)
// router.post('/resetPassword', authController.resetPassword)
// router.post('/sendVerificationCode', authController.sendVerificationCode)
// router.post('/checkVerificationCode', authController.checkVerificationCode)
// router.post('/getConnectId', authController.getConnectId);
router.post('/mongo/:searchQuery',favourites.setWatchlist)


// // stripe api
// router.post('/getStripeid', authController.getStripeid);
// router.post('/createSetupIntent', authController.createSetupIntent);
// router.post('/checkPaymentMethod', authController.checkPaymentMethod);
// router.post('/attachPaymentMethod', authController.attachPaymentMethod);


// router.get('/userVerification/:verificationtoken', authController.userVerification)


module.exports = router;