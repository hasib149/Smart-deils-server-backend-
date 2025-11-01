const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// midleware//
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartUser:1WR4uXqgRSZFzYEh@cluster0.wxainhe.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("smart server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smartServer");
    const productColection = db.collection("products");
    // post
    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      const result = await productColection.insertOne(newProducts);
      res.send(result);
    });
    // get
    app.get("/products", async (req, res) => {
      const products = await productColection.find({}).toArray();
      res.send(products);
    });

    // get single data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productColection.findOne(query);
      res.send(result);
    });

    // delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productColection.deleteOne(query);
      res.send(result);
    });
    // update
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProducts = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProducts.name,
          price: updatedProducts.price,
        },
      };
      const result = await productColection.updateOne(query, update);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`smart server is running on port ${port}`);
});
