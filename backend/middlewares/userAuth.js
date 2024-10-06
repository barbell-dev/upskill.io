const dotenv = require("dotenv");
dotenv.config();
let log = console.log;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UsersModel } = require("../db/db");
async function userAuth(req, res, next) {
  let token = req.headers.token;
  if (token) {
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      if (verifyToken) {
        next();
      } else {
        res.json({ message: "Invalid JSON token.", status: 404 });
        return;
      }
    } catch (e) {
      res
        .status(503)
        .json({ message: `Unknown error occured : ${e}`, status: 503 });
      return;
    }
  } else if (!req.body.email || !req.body.password) {
    //Directrly trying to go to /todos url without logging in should throw an error.
    res.json({ message: "Please login first" });
  } else {
    const inputPassword = req.body.password;
    try {
      const response = await UsersModel.findOne({ email: req.body.email });
      const passwordsMatch = await bcrypt.compare(
        inputPassword,
        response.password
      );
      if (passwordsMatch) {
        req.body.id = response._id.toString();

        next();
        return;
      } else {
        res.json({ message: "Invalid password.", status: 404 });
        return;
      }
    } catch (e) {
      res.json({ message: `Unknown error occured. ${e}`, status: 503 });
      return;
    }
  }
}
module.exports = userAuth;
