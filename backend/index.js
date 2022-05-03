const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

const URI = process.env.MONGO_URL;
mongoose.connect(URI, { autoIndex: true }, (err) => {
  if (err) throw err;

  console.log("Connected to mongo!");
});

app.listen(8000, () => {
  console.log("server is runing ...");
});
