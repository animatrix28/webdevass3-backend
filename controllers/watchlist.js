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

const setWatchlist = async (req, res) => {
    const searchQuery = (req.body.searchQuery);
    const operation = req.body.check;
    const exchange = req.body.exchange;

    const client = new MongoClient(process.env.mongoURI);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB Connected');

        // Get the database and collection on which to run the operation
        const db = client.db("UsStock");
        const watchlist = db.collection("Watchlist");

        if (operation === "add") {
            // console.log(operation);
            // Add stock symbol to Watchlist
            // await watchlist.insertOne({ "Symbol": searchQuery, "Exchange": exchange });
            // res.json({ "Message": "Added " + searchQuery + " to Watchlist" });
            // Perform an upsert operation to insert or update the document
            const result = await watchlist.updateOne(
                { "Symbol": searchQuery }, // Query: Search for existing document with the same symbol
                { $set: { "Symbol": searchQuery, "Exchange": exchange } }, // Update or insert with the new exchange value
                { upsert: true } // Specify upsert: true to perform an upsert operation
            );

            if (result.upsertedCount > 0) {
                // If a new document was inserted, send a message indicating that it was added to the watchlist
                res.json({ "Message": "Added " + searchQuery + " to Watchlist" });
            } else {
                // If an existing document was updated, send a message indicating that it already exists in the watchlist
                res.json({ "Message": searchQuery + " already exists in the watchlist" });
            }
        } else if (operation === "remove") {
            // console.log(operation);
            // Remove stock symbol from Watchlist
            await watchlist.deleteOne({ "Symbol": searchQuery });
            res.json({ "Message": "Removed " + searchQuery + " from Watchlist" });
        } else if (operation === "fetch") {
            // console.log(operation);
            const result = await watchlist.find({}).toArray();
            // console.log(result);
            if (result && result.length > 0) {
                const data = await Promise.all(result.map(async (item) => {
                    const symbolData = await apiCall(item.Symbol);
                    return { ...item, data: symbolData };
                }));
                // console.log(data);
                res.json({ result: data });
            } else {
                res.json({ data: 'empty' });
            }
        } else {
            // Find the document
            const filter = { Symbol: searchQuery };
            const result = await watchlist.findOne(filter);
            // console.log("Document found:" + JSON.stringify(result)+"check"+searchQuery);

            if (result) {
                res.json({ result });
            } else {
                res.json({ error: 'not available' });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

module.exports = {
    setWatchlist
};
