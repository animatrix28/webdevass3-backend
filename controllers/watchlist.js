
const { MongoClient } = require("mongodb");

const setWatchlist = async (req, res) => {
    const searchQuery = (req.params.searchQuery).toUpperCase();
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
            console.log(operation);
            // Add stock symbol to Watchlist
            await watchlist.insertOne({ "Symbol": searchQuery, "Exchange": exchange });
        }
        if (operation === "remove") {
            console.log(operation);
            // Remove stock symbol from Watchlist
            await watchlist.deleteOne({ "Symbol": searchQuery });
        }

        // Find the document
        const filter = { TickerSymbol: searchQuery };
        const result = await watchlist.findOne(filter);
        console.log("Document found:\n" + JSON.stringify(result));

        if (result) {
            res.json({ result }); 
        } else {
            res.status(404).json({ error: 'not available' });
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
