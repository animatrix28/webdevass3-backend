const https = require("https");

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // Initial delay in milliseconds
const BACKOFF_FACTOR = 2; // Factor by which delay increases with each retry

const chartsData = (req, res) => {
    const searchQuery = req.params.searchQuery;
    const from_date = req.body.from_date;
    const to_date = req.body.to_date;
    const range = req.body.range;

    console.log(from_date)
    console.log(to_date);
    // const apiEndpoint = `/v2/aggs/ticker/${searchQuery.toUpperCase()}/range/1/${range}/${from_date}/${to_date}?adjusted=true&sort=asc&apiKey=${process.env.POLYGONTOKEN}`;
    // console.log('API Endpoint:', apiEndpoint);
    const options = {
        hostname: 'api.polygon.io',
        path: `/v2/aggs/ticker/${searchQuery.toUpperCase()}/range/1/${range}/${from_date}/${to_date}?adjusted=true&sort=asc&apiKey=${process.env.POLYGONTOKEN}`,
        method: 'GET',
    };
    const makeRequest = (retries, delay) => {
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
                    handleRetry(retries, delay);
                }
            });
        });

        request.on('error', (error) => {
            console.error('Error calling the Polygon API:', error.message);
            console.log(retries);
            handleRetry(retries, delay);
        });

        request.end();
    };

    const handleRetry = (retries, delay) => {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying (${retries + 1}/${MAX_RETRIES})...`);
            retries++;
            setTimeout(() => makeRequest(retries, delay * BACKOFF_FACTOR), delay); // Retry after a delay (1 second in this example)
        } else {
            res.status(500).send({ message: 'Failed to fetch data from Polygon' });
        }
    };

    makeRequest(0, INITIAL_DELAY);


};

const func = {
    chartsData,
}

module.exports = func;


    // let from_date = "", to_date = "";
    // const currentTime = Date.now();

    // const currentDate = new Date(currentTime);
    // const lastAvailableDate = new Date(timeStamp * 1000);
    // const timeDifference = currentTime - (timeStamp * 1000);

    // const previousDay = new Date(lastAvailableDate);
    // previousDay.setDate(previousDay.getDate() - 1);

    // if (timeDifference <= 300000) {
    //     from_date = previousDay.toISOString().split('T')[0];
    //     to_date = currentDate.toISOString().split('T')[0];
    // }
    // else {
    //     const previousClosingDate = new Date(previousDay);
    //     previousClosingDate.setDate(previousClosingDate.getDate() - 1);

    //     from_date = previousClosingDate.toISOString().split('T')[0];
    //     to_date = previousDay.toISOString().split('T')[0];
    // }
    // console.log(from_date);
    // console.log(to_date);
    // console.log(timeStamp);
    // req=requests.get(f'https://api.polygon.io/v2/aggs/ticker/{search_query.upper()}/range/1/day/{from_date}/{current_date}?adjusted=true&sort=asc&apiKey=6VuFDjisS_fG7LsijpChZssp69HnBRS9')
    // {from_date}/{current_date}