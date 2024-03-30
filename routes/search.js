const router = require('express').Router();
const searchController = require('../controllers/search');
const getStockDetails = require('../controllers/stockDetail')
const getChartData = require('../controllers/chartsData')
const getNewsData = require('../controllers/newsData')
const getInsightsData = require('../controllers/insightsData')
const databaseMongoController  = require('../controllers/databaseMongo')

// router.get('/userVerification/:verificationtoken', authController.userVerification)
// router.post('/signup/:version', authController.signup);
// router.post('/signup', authController.signup);
// router.post('/signupasguest', authController.anonymousSignup);
// router.post('/signin', authController.signin);
// router.post('/changePassword', authController.changePassword)
// router.post('/updateUserProfile', authController.updateUserProfile)
// router.get('/:searchQuery', searchController.searchStock)
router.post('/:searchQuery', searchController.searchStock)
router.post('/stock_details/:searchQuery',getStockDetails.stockDetails)
router.post('/charts/:searchQuery',getChartData.chartsData)
router.post('/news/:searchQuery',getNewsData.newsData)
router.post('/insights/:searchQuery',getInsightsData.insightsData)
router.post('/mongo/:searchQuery',databaseMongoController.databaseMongo)


// router.get('/home', searchController.homeLayout)

// router.post('/resetPassword', authController.resetPassword)
// router.post('/sendVerificationCode', authController.sendVerificationCode)
// router.post('/checkVerificationCode', authController.checkVerificationCode)
// router.post('/getConnectId', authController.getConnectId);


// // stripe api
// router.post('/getStripeid', authController.getStripeid);
// router.post('/createSetupIntent', authController.createSetupIntent);
// router.post('/checkPaymentMethod', authController.checkPaymentMethod);
// router.post('/attachPaymentMethod', authController.attachPaymentMethod);


// router.get('/userVerification/:verificationtoken', authController.userVerification)


module.exports = router;