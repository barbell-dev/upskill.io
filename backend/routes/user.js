const { Router } = require("express");
// const app = express();
const userAuth = require("../middlewares/userAuth");
const dotenv = require("dotenv");
dotenv.config();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  UsersModel,
  CourseCreatorsModel,
  CoursesModel,
  PurchasesModel,
} = require("../db/db");
const express = require("express");
const userRouter = Router();
userRouter.post("/signup", async (req, res) => {
  // console.log("here");
  console.log(req.body);
  const requiredBody = z.object({
    email: z.string().max(50).min(3).email(),
    firstName: z.string().min(1).max(10),
    lastName: z.string().min(1).max(10),
    password: z.string(),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.json({
      message: "Incorrect format" + parsedBody.error,
      status: 403,
    });
    return;
  } else {
    const checkIfUserAlreadyExists = await UsersModel.findOne({
      email: parsedBody.data.email,
    });
    if (checkIfUserAlreadyExists) {
      res.json({
        message: `User with given email already exists.Try again with a different email.`,
        status: 403,
      });
      return;
    } else {
      const password = parsedBody.data.password;
      const hashedPassword = await bcrypt.hash(password, 5);
      try {
        await UsersModel.create({
          email: parsedBody.data.email,
          firstName: parsedBody.data.firstName,
          lastName: parsedBody.data.lastName,
          password: hashedPassword,
        }).then(async () => {
          let response = await UsersModel.findOne({
            email: parsedBody.data.email,
          });
          let token = jwt.sign({ id: response._id }, process.env.JWT_SECRET);
          res.json({
            message: "Successfully signed up.",
            status: 200,
            token: token,
          });
          return;
        });
      } catch (e) {
        res.status(503).json({
          message: `Unkown error occured.${e}`,
        });
        return;
      }
    }
  }
});
userRouter.use(userAuth);
userRouter.post("/login", (req, res) => {
  // console.log("here");
  let token = req.headers.token;

  if (token == "null" || token == "undefined") {
    token = jwt.sign({ id: req.body.id }, process.env.JWT_SECRET, {
      noTimestamp: true,
    });
    res
      .status(200)
      .json({ token: token, message: "Login successful", status: 200 });
    return;
  } else {
    res.status(200).json({ message: "Logged in through token", token: token });
    return;
  }
  // The case where token does not exist in the headers is handled in the userAuth middleware itself.
});

userRouter.put("/updateProfileData", (req, res) => {});
module.exports = userRouter;
