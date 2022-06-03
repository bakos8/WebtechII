const express = require("express");
const app = express();
const req = require("express/lib/request");
const ObjectId = require("mongodb").ObjectID;
const bodyParse = require("body-parser");
const path = require("path");
const { header } = require("express/lib/request");
const { async } = require("rxjs");
const { ObjectID } = require("bson");

function getClient() {
  const MongoClient = require("mongodb").MongoClient;
  const uri = "mongodb://localhost:27017";
  return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
});

app.options('/*', (_, res) => {
  res.sendStatus(200);
});

app.get("/users", function (req, res) {

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("Vehicles4Sale").collection("users");
    const users = await collection.find().toArray();
    res.send(users);
    client.close();
  });
});

app.get("/cars", function (req, res) {

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("Vehicles4Sale").collection("cars");
    const users = await collection.find().toArray();
    res.send(users);
    client.close();
  });
});

app.post('/addcar', bodyParse.json(), function (req, res) {

  const newCar = {
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
    odometer: req.body.odometer,
    price: req.body.price,
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("Vehicles4Sale").collection("cars");
    const result = await collection.insertOne(newCar);
    if (!result.insertedCount) {
      res.send({ error: "insert error" });
      return;
    }
    res.send(newCar);
    client.close();
  });
});

app.post('/register', bodyParse.json(), function(req, res){
  const newUser={
      name: req.body.name,
      password: req.body.password,
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("Vehicles4Sale").collection("users");
    const result = await collection.insertOne(newUser);
    if(!result.insertedCount){
    res.send({error: "insert error"});
    return;
    }
    res.send(newUser);
    client.close();
  });
});

function getID(raw) {
  try {
    return new ObjectId(raw);
  } catch (err) {
    return "";
  }
};

app.delete("/cars/:id", function (req, res) {

  const id = new getID(req.params.id);
  if (!id) {
    res.send({ error: "invalide id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("Vehicles4Sale").collection("cars");
    const result = await collection.deleteOne({ _id: id });
    if (!result.deletedCount) {
      res.send({ error: "not found" });
      return;
    }
    res.send({ id: req.params.id });
    client.close;
  });
});



app.listen(4000);