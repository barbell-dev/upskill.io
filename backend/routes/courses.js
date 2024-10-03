const { Router } = require("express");
const userAuth = require("../middlewares/userAuth");
const coursesRouter = Router();
// const app = express();
coursesRouter.use(userAuth);
coursesRouter.post("/purchaseCourse", (req, res) => {});
coursesRouter.get("/viewPurchasedCourses", (req, res) => {});
coursesRouter.get("/viewAllCourses", (req, res) => {});
module.exports = coursesRouter;
