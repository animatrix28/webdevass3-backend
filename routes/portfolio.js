const router = require('express').Router();
const getPortfolio = require('../controllers/stockHolding');
const addPortfolio = require('../controllers/addStocksPortfolio');
router.post('/mongo',getPortfolio.stockHolding)
router.post('/mongo/add',addPortfolio.addStocksPortfolio)

module.exports = router;