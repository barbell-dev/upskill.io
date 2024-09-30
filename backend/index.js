const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
let log = console.log;
const port = process.env.PORT || 8080;
const coursesRouter = require("./routes/courses");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
app.use("/api/v1/user", userRouter); //first parameter need not be written in the userRouter or the router mentioned in the second argument.
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/admin", adminRouter);
app.listen(port, () => {
  log(`Server listening on port ${port}`);
});
