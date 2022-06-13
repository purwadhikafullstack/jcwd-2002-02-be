const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const { dirname } = require("path");
const moment = require("moment");
const app = express();

dotenv.config();

const PORT = 2000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const loggingFormat = `${req.method} ${req.path} ${moment().format("LLL")}`;

  fs.appendFileSync(`${__dirname}/../.log`, loggingFormat + "\n");

  // res.send("<h1>Welcome to my Express API</h1>");
  next();
});

app.listen(PORT, () => {
  console.log("Listening in Port: ", PORT);
});
