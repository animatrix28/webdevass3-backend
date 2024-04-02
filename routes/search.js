const router = require('express').Router();
const searchController = require('../controllers/search');
const getStockDetails = require('../controllers/stockDetail')
const getChartData = require('../controllers/chartsData')
const getNewsData = require('../controllers/newsData')
const getInsightsData = require('../controllers/insightsData')
const databaseMongoController  = require('../controllers/databaseMongo')


router.get('/:searchQuery', searchController.searchStock)
router.get('/stock_details/:searchQuery',getStockDetails.stockDetails)
router.post('/charts/:searchQuery',getChartData.chartsData)
router.post('/news/:searchQuery',getNewsData.newsData)
router.get('/insights/:searchQuery',getInsightsData.insightsData)
router.post('/mongo/:searchQuery',databaseMongoController.databaseMongo)


module.exports = router;