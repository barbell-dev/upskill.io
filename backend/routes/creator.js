const { Router } = require("express");
const creatorAuth = require("../middlewares/creatorAuth");
const { CourseCreatorsModel, CoursesModel } = require("../db/db");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
// const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
// aws.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
// const s3 = new aws.S3();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: "https://s3.amazonaws.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
// await s3Client.send(new CreateBucketCommand({Bucket:BUCKET_NAME}));
// await s3Client.send(new PutObjectCommand)
const thumbNailMulter = multer();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: BUCKET_NAME,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldName });
//     },
//     key: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });
const creatorRouter = Router();
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
        message: `Creator with given email already exists.Try again with a different email.`,
        status: 403,
      });
      return;
    } else {
      const password = parsedBody.data.password;
      const hashedPassword = await bcrypt.hash(password, 5);
      try {
        await CourseCreatorsModel.create({
          email: parsedBody.data.email,
          firstName: parsedBody.data.firstName,
          lastName: parsedBody.data.lastName,
          password: hashedPassword,
        }).then(async () => {
          let response = await CourseCreatorsModel.findOne({
            email: parsedBody.data.email,
          });
          let token = jwt.sign(
            { id: response._id },
            process.env.JWT_ADMIN_SECRET
          );
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
creatorRouter.use(creatorAuth);

creatorRouter.post("/login", async (req, res) => {
  let token = req.headers.token;
  console.log("in creator login");
  if (token == "null" || token == "undefined") {
    token = jwt.sign({ id: req.body.id }, process.env.JWT_ADMIN_SECRET, {
      noTimestamp: true,
    });
    console.log(token);
    res.status(200).json({ token: token, message: "Admin login successful" });
    return;
  } else {
    res.status(200).json({ message: "Logged in through token", token: token });
    return;
  }
  // The case where token does not exist in the headers is handled in the userAuth middleware itself.
});
// creatorRouter.use(creatorAuth);
creatorRouter.post(
  "/createCourse",
  thumbNailMulter.single("image"),
  async (req, res) => {
    try {
      const file = req.file;
      const objectKey = file.originalname;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      const response = await s3Client.send(command);
      let courseName = req.body.courseName;
      let amount = req.body.amount;
      let token = req.headers.token;
      let coursesSearch = await CoursesModel.findOne({
        courseName: courseName,
      });
      // console.log("here");
      if (coursesSearch) {
        res.json({ message: "Course with the given name already exists." });
        return;
      } else {
        let courseCreatorData = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        let courseCreatorId = courseCreatorData.id;
        console.log("here");
        // let courseThumbnailUrl = req.protocol;
        // Read the object.
        const { Body } = await s3Client.send(
          new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectKey,
          })
        );

        console.log(Body.req.host);
        await CoursesModel.create({
          courseName: courseName,
          courseCreatorId: courseCreatorId,
          courseThumbnailUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`,
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
    } catch (e) {
      console.log("error", e);
      res.status(500).json({ message: "Unknown error occured." });
    }
    //Mongo sh
    // console.log(req.body, " ", req.file);
  }
);
creatorRouter.get("/viewAllCourses", async (req, res) => {
  try {
    const allCourses = await CoursesModel.find();
    res.status(200).json({
      message: "Fetched all courses successfully",

      courses: allCourses,
    });
    return;
  } catch (e) {
    res.json({ message: `Unknown error occured ${e}`, status: 503 });
    return;
  }
});
creatorRouter.get("/viewYourCourses", async (req, res) => {
  const courseCreatorData = jwt.verify(
    req.headers.token,
    process.env.JWT_ADMIN_SECRET
  );
  const courseCreatorId = courseCreatorData._id;
  try {
    const courses = await CoursesModel.find({
      courseCreatorId: courseCreatorId,
    });
    res.json({
      message: "Courses fetched successfully for the particular creator",
      courses: courses,
    });
    return;
  } catch (e) {
    res.status(503).json({ message: `Unkown error occured. ${e}` });
    return;
  }
});
creatorRouter.put("/updateCourse", async (req, res) => {
  try {
    let token = req.headers.token;
    let courseCreatorData = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
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
