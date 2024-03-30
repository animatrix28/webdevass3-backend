// const {
//     Users,
//     VerificationTokens,
// } = require("../models/models");
// const errorCheck = require("./utils/errors");

// const { response } = require("express");
const https = require("https");
const axios = require("axios");
const axiosRetry = require('axios-retry').default;
const finnhub = require('finnhub');

// const searchStockAPI = async (searchQuery) => {
//     const url = `https://finnhub.io/api/v1/search?q=${searchQuery}&type='Common Stock'&token=${process.env.TOKEN}`;

//     const api_key = finnhub.ApiClient.instance.authentications['api_key'];
//     api_key.apiKey = process.env.TOKEN
//     const finnhubClient = new finnhub.DefaultApi()

//     finnhubClient.symbolSearch(searchQuery, (error, data, response) => {
//         // console.log(data)
//         return data
//     });

// }

// const searchStock = async (req, res) => {
//     try {
//         const searchQuery = req.params.searchQuery;
//         console.log(searchQuery);
//         // const url = `https://finnhub.io/api/v1/search?q=${searchQuery}&type='Common Stock'&token=${process.env.TOKEN}`;

//         // // Configure Axios to use axios-retry
//         // axiosRetry(axios, {
//         //     retries: 3,
//         //     retryDelay: (retryCount) => {
//         //         return retryCount * 1000; // Time between retries increases with each retry attempt
//         //     },
//         //     retryCondition: (error) => {
//         //     // A function to determine if the error should be retried
//         //     // For example, retry for any network error or a 5xx response
//         //         return error.isAxiosError || (error.response && error.response.status >= 500);
//         //     }
//         // });

//         // const data = await axios.get(url, {
//         //     timeout: 10000, // Timeout in milliseconds
//         //     headers: {
//         //         'Content-Type': 'application/json'
//         //     },
//         //     proxy: {
//         //         host: '127.0.0.1',
//         //         port: 9000,
//         //     }
//         // });

//         // Send the result back to the client
//         // console.log(data);
//         // return res.status(200).json(data);

//         // let data = await searchStockAPI(searchQuery)
//         // console.log(data);
//         // return res.status(200).json({ data: data });
//         const api_key = finnhub.ApiClient.instance.authentications['api_key'];
//         api_key.apiKey = process.env.TOKEN
//         const finnhubClient = new finnhub.DefaultApi()

//         finnhubClient.symbolSearch(searchQuery, (error, data, response) => {
//             // console.log(data)
//             return res.status(200).json({ data: data });
//         });


//         // // return res.status(200).send({"searchQuery": searchQuery});
//         // // return res.status(200).json({"Animesh": searchQuery});
//         // // return res.status(200);
//     } catch (error) {
//         console.log(error);
//         console.error('Error calling the Finnhub API:', error.message);
//         res.status(500).send({ message: 'Failed to fetch data from Finnhub' });
//     }
// };
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