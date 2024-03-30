const https = require("https");

const MAX_RETRIES = 3;
const FINNHUB_API_TOKEN = process.env.TOKEN;
const API_HOST = 'finnhub.io';

// Reusable function for making HTTPS requests
const makeRequest = (options) => {
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Request failed with status code ${response.statusCode}`));
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
};

const api1 = (searchQuery) => {
    const options = {
        hostname: API_HOST,
        path: `/api/v1/stock/recommendation?symbol=${searchQuery}&token=${FINNHUB_API_TOKEN}`,
        method: 'GET',
    };

    return makeRequest(options);
};

const api2 = (searchQuery) => {
    const options = {
        hostname: API_HOST,
        path: `/api/v1/stock/insider-sentiment?symbol=${searchQuery}&from=2022-01-01&token=${FINNHUB_API_TOKEN}`,
        method: 'GET',
    };

    return makeRequest(options);
};

const api3 = (searchQuery) => {
    const options = {
        hostname: API_HOST,
        path: `/api/v1/stock/earnings?symbol=${searchQuery}&token=${FINNHUB_API_TOKEN}`,
        method: 'GET',
    };

    return makeRequest(options);
};

const insightsData = async (req, res) => {
    const searchQuery = (req.params.searchQuery).toUpperCase();

    try {
        // Make API calls in parallel
        const [recommendationAPI, sentimentAPI, earningsAPI] = await Promise.all([
            api1(searchQuery),
            api2(searchQuery),
            api3(searchQuery),
        ]);

        // Combine data from all APIs
        const combinedData = {
            recommendationAPI,
            sentimentAPI,
            earningsAPI
        };

        res.send({ data: combinedData });
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch data from APIs' });
    }
};

module.exports = {
    insightsData
};