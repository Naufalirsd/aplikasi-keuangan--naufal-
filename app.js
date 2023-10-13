const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017";
const dbName = "catatan-keuangan";

app.use(bodyParser.json());

// Endpoint untuk menambahkan pembelian baru
app.post("/purchases", (req, res) => {
    const purchaseData = req.body;

    MongoClient.connect(url, (err, client) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const db = client.db(dbName);
        const purchasesCollection = db.collection("purchases");

        purchasesCollection.insertOne(purchaseData, (err, result) => {
            client.close();
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send("Data pembelian berhasil disimpan");
            }
        });
    });
});

// Endpoint untuk mendapatkan daftar pembelian
app.get("/purchases", (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const db = client.db(dbName);
        const purchasesCollection = db.collection("purchases");

        purchasesCollection.find({}).toArray((err, data) => {
            client.close();
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(data);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
