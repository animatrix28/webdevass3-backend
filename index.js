const express = require('express');
require("dotenv").config();

const app = express();

require('./config/environments')(app, express);
require('./config/routes')(app);
require('./config/connection')(app);