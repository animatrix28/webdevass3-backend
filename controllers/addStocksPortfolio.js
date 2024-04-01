const { MongoClient } = require("mongodb");

const addStocksPortfolio = async (req, res) => {
    const currentPrice = parseFloat(req.body.currentPrice);
    const tickerSymbol = req.body.tickerSymbol;
    const quantity = parseFloat(req.body.quantity);
    const totalPrice = parseFloat(currentPrice) * parseFloat(quantity);
    const operation = req.body.operation;
    const client = new MongoClient(process.env.mongoURI);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB Connected');

        // Get the database and collection on which to run the operation
        const db = client.db("UsStock");
        const stockHoldings = db.collection("StockHoldings");
        const updateWallet = db.collection("Wallet");

        // Find the document with the given tickerSymbol
        const query = { tickerSymbol: tickerSymbol };
        const existingDocument = await stockHoldings.findOne(query);
        console.log(existingDocument);
        if (existingDocument) {
            if (operation === "buy") {
                console.log(operation)
                const update = {
                    $set: {
                        tickerSymbol: tickerSymbol,
                        companyName: req.body.companyName
                    },
                    $inc: {
                        totalPrice: totalPrice,
                        quantity: quantity
                    }
                };
                const options = { upsert: true, returnOriginal: false };
                const result = await stockHoldings.findOneAndUpdate(query, update, options);
                const updatedDocument = result;
                // console.log(updatedDocument)
                const avgCost = updatedDocument.totalPrice / updatedDocument.quantity;
                await stockHoldings.updateOne({ _id: updatedDocument._id }, { $set: { avgCost: avgCost } });
                const walletUpdateQuery = { _id: 0 };
                const walletUpdate = { $inc: { balance: -totalPrice } };
                await updateWallet.updateOne(walletUpdateQuery, walletUpdate);
                res.json({ data: updatedDocument });
            } else if (operation === "sell") {
                const updatedTotalPrice = existingDocument.totalPrice - totalPrice;
                const updatedQuantity = existingDocument.quantity - quantity;
                if (updatedQuantity <= 0) {
                    // Remove document if quantity becomes 0
                    await stockHoldings.deleteOne(query);
                } else {
                    const avgCost = updatedTotalPrice / updatedQuantity;
                    await stockHoldings.updateOne(query, {
                        $set: {
                            totalPrice: updatedTotalPrice,
                            quantity: updatedQuantity,
                            avgCost: avgCost
                        }
                    });
                }
                const walletUpdateQuery = { _id: 0 };
                const walletUpdate = { $inc: { balance: totalPrice } };
                await updateWallet.updateOne(walletUpdateQuery, walletUpdate);
                res.json({ message: "Stocks sold successfully." });
            }
        } else {
            // Document with tickerSymbol doesn't exist, insert new document
            if (operation === "buy") {
                const documentToInsert = {
                    tickerSymbol: tickerSymbol,
                    companyName: req.body.companyName,
                    totalPrice: totalPrice,
                    quantity: quantity,
                    avgCost: currentPrice  // Initialize avgCost with currentPrice
                };
                await stockHoldings.insertOne(documentToInsert);
                const walletUpdateQuery = { _id: 0 };
                const walletUpdate = { $inc: { balance: -totalPrice } };
                await updateWallet.updateOne(walletUpdateQuery, walletUpdate);
                res.json({ data: "Successfull" });
                // Update wallet balance
                // Return response
            } else {
                res.status(404).json({ error: "Error adding." });
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
    addStocksPortfolio
};
