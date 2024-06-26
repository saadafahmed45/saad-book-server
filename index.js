const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 7000;
// middelware
app.use(cors());
app.use(express.json());

// Db Name : saadBookDb
// pass : bFLG1mqlCa4e02su;

const dbUserName = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
console.log(dbUserName, dbPassword);
// mongoDb import
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.58zpnyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// mongoDb crud
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("bookUserDb");
    const userCollection = database.collection("users");
    const AdminCollection = database.collection("Admin");

    // here all crud oparation

    // post user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    //

    // get  all data
    app.get("/users", async (req, res) => {
      // res.send(users);
      const cusor = userCollection.find();
      const result = await cusor.toArray();
      res.send(result);
    });

    // get single data

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // Delete the first document in  collection

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete id ", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // update

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const users = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateUsers = {
        $set: {
          name: users.name,
          email: users.email,
          age: users.age,
          number: users.number,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateUsers,
        option
      );
      res.send(result);
      console.log(result);
    });

    //  user role api

    // post user role
    app.post("/users/admin", async (req, res) => {
      const user = req.body;
      const result = await AdminCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });
    // get  user role
    app.get("/users/admin", async (req, res) => {
      // res.send(users);
      const cusor = AdminCollection.find();
      const result = await cusor.toArray(); 
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Saad-Book Database");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
