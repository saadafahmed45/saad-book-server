const express = require("express");
const app = express();
const cors = require("cors");

const port = 7000;
// middelware
app.use(cors());
app.use(express.json());

// Db Name : saadBookDb
// pass : bFLG1mqlCa4e02su;

// mongoDb import
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://saadBookDb:bFLG1mqlCa4e02su@cluster0.58zpnyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // here all crud oparation

    // post user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    // get  all data
    app.get("/users", async (req, res) => {
      // res.send(users);
      const cusor = userCollection.find();
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
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
