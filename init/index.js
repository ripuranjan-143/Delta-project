//This code is written to initialize a MongoDB database with some sample data using Mongoose, a popular MongoDB ORM (Object Relational Mapping) library for Node.js.

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust';
main()
  .then((res) => {
    console.log("Connected to DB")
  })
  .catch((err) => {
    console.log(err)
  })

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "684b1d90fd10b165de3cb86f"}))
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
}

initDB();