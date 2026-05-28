const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const RentalCarsCollection = database.collection("addedCars");

    app.get("/available-cars", async (req, res) => {
      const result = await carsCollection.find().toArray();
      res.send(result);
    });

    app.get("/available-cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await carsCollection.findOne(query);
      res.send(result);
    });

    app.post("/added-cars", async (req, res) => {
      const rentalCarData = req.body;
      const result = await RentalCarsCollection.insertOne(rentalCarData);
      res.send(result);
    });

    app.get("/added-cars", async (req, res) => {
      const result = await RentalCarsCollection.find().toArray();
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
