require("dotenv").config();
const connectDB = require("./db/connect");
const ProductDocument = require("./models/product");
const jsonProducts = require("./products.json");

const populateDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await ProductDocument.deleteMany();
    await ProductDocument.create(jsonProducts);
    console.log("successfully populated the database");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

populateDB();
