
const { MongoClient } = require("mongodb");
const https = require("https");

const FINNHUB_API_TOKEN = process.env.TOKEN;
const API_HOST = 'finnhub.io';

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
const apiCall = (searchQuery) => {
    const options = {
        hostname: API_HOST,
        path: `/api/v1/quote?symbol=${searchQuery.toUpperCase()}&token=${FINNHUB_API_TOKEN}`,
        method: 'GET',
    };

    try {
        const response = makeRequest(options);
        return response;
    } catch (error) {
        console.error('Error making API call:', error);
        throw error;
    }
};

const stockHolding = async (req, res) => {
    const operation = req.body.check;
    const client = new MongoClient(process.env.mongoURI);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB Connected');

        // Get the database and collection on which to run the operation
        const db = client.db("UsStock");
        const stockHoldings = db.collection("StockHoldings");

        // Find the document
        const stockHoldingsCollection = await stockHoldings.find({}).toArray();
        const data = {
            stockHolding: stockHoldingsCollection
        }
        // console.log("Document found:\n" + JSON.stringify(data));

        // Send the balance back to the client
        if (stockHoldingsCollection) {
            // console.log(stockHoldingsCollection)
            if (operation === "portfolio") {
                const data1 = await Promise.all(stockHoldingsCollection.map(async (item) => {
                    const symbolData = await apiCall(item.tickerSymbol);
                    // console.log("Animesh");
                    // console.log(symbolData)
                    return { ...item, currentPrice: symbolData.c };
                }));
                // console.log(data1);
                res.json({ result: data1 });
            }
            // console.log(data)
            else {
                res.json({ data });
            }
        } else {
            res.json({ error: 'not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

module.exports = {
    stockHolding
};