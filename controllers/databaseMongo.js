
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
        const stockHoldings = db.collection("StockHoldings");

        // Find the document
        const filter = { _id: 0 };
        const walletCollection = await wallet.findOne(filter);
        const stockHoldingsCollection = await stockHoldings.find({}).toArray();
        const data = {
            balance: walletCollection.balance,
            stockHolding: stockHoldingsCollection
        }
        console.log("Document found:\n" + JSON.stringify(data));

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


// const mongoose = require('mongoose');
// const Wallet = require('../models/Wallet');

// const databaseMongo = async (req, res) => {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('MongoDB Connected');

//         // Fetch balance from the Wallet collection
//         const walletData = await Wallet.find({ "_id": 0 });
//         console.log('Retrieved data:', walletData);
//         // Send the balance back to the client
//         if (walletData) {
//             res.json({ balance: walletData.balance });
//         } else {
//             res.status(404).json({ error: 'Balance not found' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// module.exports = {
//     databaseMongo
// };


// const Mongouri = "mongodb+srv://animatrix:animatrix007@cluster0.7xpsfpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// mongodb+srv://animatrix:<password>@cluster0.7xpsfpm.mongodb.net/

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(Mongouri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);
// const databaseMongo = (req, res) => {
//     const searchQuery = req.params.searchQuery;
//     mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));
// }
// const func = {
//     databaseMongo,
// }

// module.exports = func;