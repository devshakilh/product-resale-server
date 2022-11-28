const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w0pu2sb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('product').collection('product');
        const bookingCollection = client.db('product').collection('booking');
        const addCollection = client.db('product').collection('add');
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const product = await cursor.limit(3).toArray();
            res.send(product);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;

            const query = { category_id: (id) };
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.post('/booking', async (req, res) => {
            const booking = req.body

            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })
        // serverApi 

        app.get('/add', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = addCollection.find(query);
            const add = await cursor.toArray();
            res.send(add);

        });
        app.post('/add', async (req, res) => {
            const add = req.body;
            const result = await productCollection.insertOne(add);
            res.send(result);
        });
        app.get('/add/:id', async (req, res) => {
            const id = req.params.id;

            const query = { category_id: (id) };
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });

    }
    finally {

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('product cae server is running')

})
app.listen(port, () => {
    console.log(`product car server running on ${port}`);
})