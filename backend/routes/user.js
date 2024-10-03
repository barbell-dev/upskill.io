const { Router } = require("express");
// const app = express();
const { userAuth } = require("../middlewares/userAuth");
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
const userRouter = Router();
userRouter.use(userAuth);
userRouter.post("/login", (req, res) => {
  let token = req.headers.token;
  if (!token) {
    token = jwt.sign({ id: req.body.id }, process.env.JWT_SECRET, {
      noTimestamp: true,
    });
    res.json({ token: token, message: "Login successful", status: 200 });
    return;
  }
  // The case where token does not exist in the headers is handled in the userAuth middleware itself.
});
userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().max(50).min(11).email(),
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
          let response = await UserModel.findOne({
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
        res.json({ message: `Unkown error occured.${e}`, status: 503 });
        return;
      }
    }
  }
});
userRouter.put("/updateProfileData", (req, res) => {});
module.exports = userRouter;
