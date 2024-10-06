const { Router } = require("express");
const jwt = require("jsonwebtoken");
let log = console.log;
const dotenv = require("dotenv");
dotenv.config();
// const {body-parser} =
const userAuth = require("../middlewares/userAuth");
const { PurchasesModel, CoursesModel } = require("../db/db");
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
      res.json({ message: `Course ${courseName} inserted.`, status: 200 });
      return;
    })
    .catch((e) => {
      res.json({ message: `Unknown error occured`, status: 503 });
      console.log(e);

      return;
    });
});
coursesRouter.get("/viewPurchasedCourses", async (req, res) => {
  const token = req.headers.token;
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const userId = userData._id;
  try {
    const purchasedCoursesOfLoggedInUser = await PurchasesModel.find({
      purchasedBy: userId,
    });
    res.json({
      message: "Fetched the courses of logged in user successfully.",
      status: 200,
      purchasedCourses: purchasedCoursesOfLoggedInUser,
    });
    return;
  } catch (e) {
    res.json({ message: "Unknown error occured.", status: 503 });
    log(e);
    return;
  }
});
coursesRouter.get("/viewAllCourses", async (req, res) => {
  const allCourses = await CoursesModel.find().then(() => {
    res.json({
      message: "Fetched all courses successfully.",
      status: 200,
      allCourses: allCourses,
    });
    return;
  });
});
coursesRouter.get("/viewParticularCourse", (req, res) => {
  const courseName = req.body.courseName;
});
module.exports = coursesRouter;
