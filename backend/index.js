const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
dotenv.config();
app.use(cors());
const connectionString = process.env.CONNECTION_STRING;
let log = console.log;
const port = process.env.PORT || 8080;
const coursesRouter = require("./routes/courses");
const creatorRouter = require("./routes/creator");
const userRouter = require("./routes/user");
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter); //first parameter need not be written in the userRouter or the router mentioned in the second argument.
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/creator", creatorRouter);
async function main() {
  // log("here");
  await mongoose
    .connect(connectionString)
    .then(() => {
      app.listen(port, () => {
        log(`Server listening on port ${port}`);
      });
    })
    .catch((e) => {
      log(`Error ${e}`);
    });
}
main();
