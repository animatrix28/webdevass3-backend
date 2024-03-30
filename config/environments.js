const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

module.exports = function(app, express) {
  app.use(logger('dev'));
  console.log(__dirname)
  app.use(express.static(path.join(__dirname, '../public')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({limit: '50mb'}));
  // parse JSON bodies
  app.use(express.json());

    // parse url-encoded odies (as sent by html forms)
    app.use(express.urlencoded({ extended: false }));

    // initialize cookie parser so we can set up cookie in our browser
    app.use(cookieParser());
    app.use(cors());
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      next();
    });


}