const homeRouter = require("../routes/home");
const searchRouter = require("../routes/search");
const watchlistRouter = require("../routes/watchlist");
const portfolioRouter = require("../routes/portfolio");

const createError = require("http-errors");

module.exports = function (app) {

  app.use("/search", searchRouter);
  app.use("/watchlist", watchlistRouter);
  app.use("/portfolio", portfolioRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    })
    // res.render("error");
  });
};