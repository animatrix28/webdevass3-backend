const https = require("https");

const MAX_RETRIES = 3;

const newsData = (req, res) => {
    const searchQuery = req.params.searchQuery;
    const from_date = req.body.from_date;
    const to_date = req.body.to_date;

    console.log(from_date)
    console.log(to_date);
    const options = {
        hostname: 'finnhub.io',
        path: `/api/v1/company-news?symbol=${searchQuery.toUpperCase()}&from=${from_date}&to=${to_date}&token=${process.env.TOKEN}`,
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
            res.status(500).send({ message: 'Failed to fetch data from Polygon' });
        }
    };

    makeRequest(0);


};

const func = {
    newsData,
}

module.exports = func;