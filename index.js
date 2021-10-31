const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const cors = require('cors');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u0mil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();

    const database = client.db("tour_bookings");
    const bookCollection = database.collection("booking");
    const orderCollection = database.collection("orders");
    
    //GET API
    app.get('/bookings', async(req, res) => {
      const bookings = bookCollection.find({});
      const result = await bookings.toArray();
      res.send(result);
    })
    app.get('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const booking = {_id:ObjectId(id)};
      const result = await bookCollection.findOne(booking);
      res.json(result);
    })
    app.get('/orders', async(req, res) => {
      const orders = orderCollection.find({});
      const result = await orders.toArray();
      res.send(result);
    })
    //POST API
    app.post('/bookings', async(req, res) => {
      const addBooking = req.body;
      const result = await bookCollection.insertOne(addBooking);
      res.json(result);
    })
    app.post('/orders', async(req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    })

    //delete api
    app.delete('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const deletedItem = {_id: ObjectId(id)};
        const result = await orderCollection.deleteOne(deletedItem);
        console.log(result);
        res.json(result);
    })

    //update api
      app.put('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const updateInfo = req.body;
        console.log(updateInfo);
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set:{
                status: 'Approved'
            }
        }
        const result = await orderCollection.updateOne(filter, updateDoc, options);
        console.log(result);

        res.json(result);
      })
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})