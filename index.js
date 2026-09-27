const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


app.get('/',(req,res) =>{
    res.send('simple Crud server is running')
})


 async function run(){
     try{
        await client.connect()

        const usersDB = client.db('usersDB');
        const usersCollection = usersDB.collection('users')
        
      app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray()
        res.send(result)
      })
        // await client.db('admin').command({ping: 1})
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //add database related apis here
        // app.post('/users',(req,res)=>{
        //     console.log('hitting the user post api')
        // })
     
        app.post('/users', async (req, res) => {
          console.log('hitting the user post api');
      
          const newUser = req.body;
          console.log(newUser);
      
          const result = await usersCollection.insertOne(newUser);
      
          res.send(result);
      })

      app.delete('/users/:id',(req,res)=>{
        console.log('delete a user from database')
      })
     }
     finally{

     }
 }
 run().catch(console.dir)
 app.listen(port, ()=>{
    console.log(`Simple Crud server is running on port ${port}`);
})
/**
 * 1.at least one user
 * 2.set uri with userId and password
 * 3.create a mongodb client
 * 4.add a run function to connect to the database
 * 5.use try finally inside it to connect the client
 * 6.ping the database to see server is alive or not 
 */