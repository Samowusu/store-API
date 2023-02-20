require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const app = express();

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const productsRoute = require("./routes/products");
const PORT = 5000;

// middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", productsRoute);

app.use(notFound);
app.use(errorHandler);

const init = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();
