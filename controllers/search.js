
const https = require("https");
const axios = require("axios");
const axiosRetry = require('axios-retry').default;
const finnhub = require('finnhub');

const MAX_RETRIES = 3;

const searchStock = (req, res) => {
    const searchQuery = req.params.searchQuery;

    const options = {
        hostname: 'finnhub.io',
        path: `/api/v1/search?q=${searchQuery}&type=Common%20Stock&token=${process.env.TOKEN}`,
        method: 'GET',
    };

    const makeRequest = (retries) => {
        const request = https.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    const parsedData = JSON.parse(data);
                    // console.log(parsedData);

                    // Send the data back to the client or perform other actions
                    res.status(200).json({ data: parsedData });
                } else {
                    console.error(`HTTP error! Status: ${response.statusCode}`);
                    handleRetry(retries);
                }
            });
        });

        request.on('error', (error) => {
            console.error('Error calling the Finnhub API:', error.message);
            console.log(retries);
            handleRetry(retries);
        });

        request.end();
    };

    const handleRetry = (retries) => {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying (${retries + 1}/${MAX_RETRIES})...`);
            retries++;
            setTimeout(() => makeRequest(retries), 1000); // Retry after a delay (1 second in this example)
        } else {
            res.status(500).send({ message: 'Failed to fetch data from Finnhub' });
        }
    };

    makeRequest(0);
};

const func = {
    searchStock,
}

module.exports = func;