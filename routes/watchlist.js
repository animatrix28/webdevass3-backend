const router = require('express').Router();
const favourites = require('../controllers/watchlist');
router.post('/mongo',favourites.setWatchlist)


module.exports = router;