
const { MongoClient } = require("mongodb");

const databaseMongo = async (req, res) => {
    const client = new MongoClient(process.env.mongoURI);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB Connected');

        // Get the database and collection on which to run the operation
        const db = client.db("UsStock");
        const wallet = db.collection("Wallet");
        // Find the document
        const filter = { _id: 0 };
        const walletCollection = await wallet.findOne(filter);
        const data = {
            balance: walletCollection.balance
        }

        // Send the balance back to the client
        if (walletCollection) {
            res.json({ data }); // Assuming 'balance' is a field in the document
        } else {
            res.status(404).json({ error: 'Balance not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

module.exports = {
    databaseMongo
};