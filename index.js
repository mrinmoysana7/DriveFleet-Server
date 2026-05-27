const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("drivefleet");
    const carsCollection = database.collection("cars");

    app.post("/rental-car", async (req, res) => {
      const rentalCarData = req.body;
      const result = await carsCollection.insertOne(rentalCarData);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cars are available");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
