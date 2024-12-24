const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const connectWithDB = require("./config/db");
const router = require("./routes");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const PORT = 8000 || process.env.PORT;

app.use("/api", router);

connectWithDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to the database");
    console.log("Server is running on port:", PORT);
  });
});
