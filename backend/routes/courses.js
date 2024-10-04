const { Router } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// const {body-parser} =
const userAuth = require("../middlewares/userAuth");
const { PurchasesModel } = require("../db/db");
const coursesRouter = Router();
// const app = express();
// coursesRouter.use
coursesRouter.use(userAuth);
coursesRouter.post("/purchaseCourse", async (req, res) => {
  const dateOfPurchase = new Date();
  const token = req.headers.token;
  const courseName = req.body.courseName;
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const userId = userData._id;
  await PurchasesModel.create({
    purchasedBy: userId,
    dateOfPurchase: dateOfPurchase,
    courseName: courseName,
  })
    .then(() => {
      res.json({ message: `Course ${courseName} inserted.` });
      return;
    })
    .catch((e) => {
      res.json({ message: `Unknown error occured` });
      console.log(e);

      return;
    });
});
coursesRouter.get("/viewPurchasedCourses", (req, res) => {});
coursesRouter.get("/viewAllCourses", (req, res) => {});
coursesRouter.get("/viewParticularCourse", (req, res) => {});
module.exports = coursesRouter;
