const { Router } = require("express");
// const app = express();
const {
  UsersModel,
  CourseCreatorsModel,
  CoursesModel,
  PurchasesModel,
} = require("../db/db");
const userRouter = Router();

userRouter.post("/login", (req, res) => {});
userRouter.post("/signup", (req, res) => {});
module.exports = userRouter;
