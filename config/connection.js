
const http = require("http");
// const sequelize = require("../util/database");
// const models = require("../models/models") // need this to update models

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    // var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            // console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            // console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

module.exports = function (app) {
    try {
        const server = http.createServer(app);
        /**
         * Get port from environment and store in Express.
         */
        server.timeout = 600000;

        const httpServer = server.listen(
            { port: process.env.PORT || 9000 },
            () => {
                console.log(
                    `Server ready at http://localhost:${process.env.PORT || 9000}`
                );
            }
        );
            
    } catch (err) {
        console.log(err);
    }

};