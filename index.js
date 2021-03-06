const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txk2a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('auto-car-inc').collection('parts')
        const orderCollection = client.db('auto-car-inc').collection('orders')
        const reviewCollection = client.db('auto-car-inc').collection('review')
        const profileCollection = client.db('auto-car-inc').collection('profile')

        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })

        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const parts = await partsCollection.findOne(query);
            res.send(parts);
        })

        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            return res.send(result);
        })

        app.delete('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const result = await orderCollection.deleteOne(query);
            return res.send(result);
        })

        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find().toArray();
            res.send(orders)
        })
        app.get('/review', async(req ,res) => {
            const review = await reviewCollection.find().toArray();
            res.send(review)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
          })
        app.post('/profile', async (req, res) => {
            const review = req.body;
            const result = await profileCollection.insertOne(review)
            res.send(result)
          })
          app.get('/profile', async(req, res) => {
              const profile = await profileCollection.find().toArray();
              res.send(profile)
          })

    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Auto Car Inc')
})

app.listen(port, () => {
    console.log(`Auto Car Inc App listening on port ${port}`)
})