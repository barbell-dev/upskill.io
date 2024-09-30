const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/login");
adminRouter.post("/signup");
// adminRouter.use(adminAuth);
adminRouter.post("/createCourse");
adminRouter.get("/viewAllCourses");
adminRouter.put("/updateCourse");
module.exports = adminRouter;
