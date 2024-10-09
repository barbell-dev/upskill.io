const dotenv = require("dotenv");
dotenv.config();
let log = console.log;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CourseCreatorsModel } = require("../db/db");
async function creatorAuth(req, res, next) {
  let token = req.headers.token;
  if (token) {
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      if (verifyToken) {
        next();
      } else {
        res.json({ message: "Invalid JSON token.", status: 404 });
        return;
      }
    } catch (e) {
      res.json({ message: `Unknown error occured : ${e}`, status: 503 });
      return;
    }
  } else if (!req.body.email || !req.body.password) {
    //Directrly trying to go to /todos url without logging in should throw an error.
    res.json({ message: "Please login first", status: 403 });
    return;
  } else {
    const inputPassword = req.body.password;
    try {
      const response = await CourseCreatorsModel.findOne({
        email: req.body.email,
      });
      const passwordsMatch = await bcrypt.compare(
        inputPassword,
        response.password
      );
      if (passwordsMatch) {
        req.body.id = response._id.toString();
        next();
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
module.exports = creatorAuth;
