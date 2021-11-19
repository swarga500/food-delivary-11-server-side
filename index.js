const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;




// middlewre 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxher.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        client.connect();
        const database =client.db('airtickets');
        const ticketsCollection = database.collection('tickets');
        const orderCollection = database.collection('orders')
        
        // get api 
        app.get('/tickets', async (req,res)=>{
              const cursor = ticketsCollection.find({});
              const tickets = await cursor.toArray();
              res.send(tickets)
        })

        // post api
        app.post('/tickets', async (req,res) =>{
            const ticket = req.body;
            console.log('hit')
            const result = await ticketsCollection.insertOne(ticket)
            console.log(result)
            res.json(result)
        });
    //     // order api post 
        app.post('/orders', async (req,res)=>{
            const order = req.body;
            console.log('post hit',order)
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // order get api 
        app.get('/orders', async (req,res)=>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
      })

      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);

        res.json(result);
    })



    }
    finally{
        // await client.close()
    }

}

run().catch(console.dir)
app.get('/', (req,res) =>{
    res.send("servoer running")
});


app.listen(port, ()=>{
    console.log('server is runnig', port)
})