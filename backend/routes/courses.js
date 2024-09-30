const { Router } = require("express");
const coursesRouter = Router();
// const app = express();
coursesRouter.post("/purchaseCourse", (req, res) => {});
coursesRouter.get("/viewPurchasedCourses", (req, res) => {});
coursesRouter.get("/viewAllCourses", (req, res) => {});
module.exports = coursesRouter;
