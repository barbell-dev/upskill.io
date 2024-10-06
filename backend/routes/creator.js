const { Router } = require("express");
const creatorAuth = require("../middlewares/creatorAuth");
const { CourseCreatorsModel, CoursesModel } = require("../db/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const creatorRouter = Router();
creatorRouter.use(creatorAuth);
creatorRouter.post("/login", async (req, res) => {
  let token = req.headers.token;
  if (!token) {
    token = jwt.sign({ id: req.body.id }, process.env.JWT_SECRET, {
      noTimestamp: true,
    });
    res.json({ token: token, message: "Admin login successful", status: 200 });
    return;
  }
  // The case where token does not exist in the headers is handled in the userAuth middleware itself.
});
creatorRouter.post("/signup", async (req, res) => {
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
    const checkIfUserAlreadyExists = await CourseCreatorsModel.findOne({
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
// creatorRouter.use(creatorAuth);
creatorRouter.post("/createCourse", async (req, res) => {
  let courseName = req.body.courseName;
  let amount = req.body.amount;
  let token = req.headers.token;
  let coursesSearch = await CoursesModel.findOne({ courseName: courseName });
  if (coursesSearch) {
    res.json({ message: "Course with the given name already exists." });
    return;
  } else {
    let courseCreatorData = jwt.verify(token, process.env.JWT_SECRET);
    let courseCreatorId = courseCreatorData.id;

    await CoursesModel.create({
      courseName: courseName,
      courseCreatorId: courseCreatorId,
      amount: amount,
    })
      .then(() => {
        res.json({ message: "Course created successfully.", status: 200 });
        return;
      })
      .catch((e) => {
        res.json({ message: `Unknown error occured. ${e}`, status: 503 });
        return;
      });
  }
});
creatorRouter.get("/viewAllCourses", async (req, res) => {
  try {
    const allCourses = await CoursesModel.find();
    res.json({
      message: "Fetched all courses successfully",
      status: 200,
      courses: allCourses,
    });
    return;
  } catch (e) {
    res.json({ message: `Unknown error occured ${e}`, status: 503 });
    return;
  }
});
creatorRouter.put("/updateCourse", async (req, res) => {
  try {
    let token = req.headers.token;
    let courseCreatorData = jwt.verify(token, process.env.JWT_SECRET);
    let courseCreatorId = courseCreatorData._id;
    const oldCourseName = req.body.oldCourseName;
    const newCourseName = req.body.newCourseName;
    const newAmount = req.body.newAmount;
    const oldAmount = req.body.oldAmount;
    if (oldAmount == null || oldAmount == undefined) {
      await CoursesModel.updateOne(
        {
          courseName: oldCourseName,
          amount: oldAmount,
          courseCreatorId: courseCreatorId,
        },
        { $set: { courseName: newCourseName } }
      ).then(() => {
        res.json({ message: "updated", status: 200 });
        return;
      });
    } else if (oldCourseName == undefined || oldCourseName == null) {
      CoursesModel.updateOne(
        {
          courseName: oldCourseName,
          amount: oldAmount,
          courseCreatorId: courseCreatorId,
        },
        { $set: { amount: newAmount } }
      ).then(() => {
        res.json({ message: "updated", status: 200 });
        return;
      });
    } else {
      CoursesModel.updateOne(
        {
          courseName: oldCourseName,
          amount: oldAmount,
          courseCreatorId: courseCreatorId,
        },
        { $set: { courseName: newCourseName, amount: newAmount } }
      ).then(() => {
        res.json({ message: "updated", status: 200 });
        return;
      });
    }
  } catch (e) {
    // log(e);
    res.json({ message: `Unknown error occured ${e}`, status: 503 });
  }
});
module.exports = creatorRouter;
