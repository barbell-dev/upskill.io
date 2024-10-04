const mongoose = require("mongoose");
const dotenv = require("dotenv");
let log = console.log;
dotenv.config();
const connectionString = process.env.CONNECTION_STRING;
const ObjectId = mongoose.Schema.ObjectId;

/*
Users: {
    _id=>ObjectId
    firstname:String
    lastname:String
    email:String
    password:String(storing the hash of the password)
}
CourseCreators:{
    _id:ObjectId
    firstName:String
    lastName:String
    email:String
    password:String(storing the hash of the password)
}
Courses:{
    _id:ObjectId,
    course name:String
    course ID : String
    createdBy : ID of course creator(_id in course creator collection).
    amount:Integer
}
    Purchases:{
        _id:Object ID
        purchased By:_id of user.
        date of purchase : (Exact time including hours minutes and seconds)
        course_ID
    }
*/

const UsersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});
const UsersModel = mongoose.model("Users", UsersSchema);
const CourseCreatorsSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});
const CourseCreatorsModel = mongoose.model(
  "CourseCreators",
  CourseCreatorsSchema
);

const CoursesSchema = new mongoose.Schema({
  courseName: { type: String, unique: true },
  courseCreatorId: {
    type: mongoose.Schema.ObjectId,
    ref: "CourseCreators",
    required: true,
  },
  amount: Number,
});
const CoursesModel = mongoose.model("Courses", CoursesSchema);
const PurchasesSchema = new mongoose.Schema({
  purchasedBy: {
    type: ObjectId,
    ref: "Users",
    required: true,
  },
  dateOfPurchase: String,
  courseName: {
    type: String,
    ref: "Courses",
    required: true,
  },
});

PurchasesSchema.index({ purchasedBy: 1, courseName: 1 }, { unique: true });
//while using PurchaseModel , I gotta make sure to use PurchaseModel(... coursesId._id) inorder to access the courseId of the course . courseId.courseCreatorId would give the courseCreator Id of the course
const PurchasesModel = mongoose.model("Purchases", PurchasesSchema);
module.exports = {
  UsersModel,
  CourseCreatorsModel,
  CoursesModel,
  PurchasesModel,
};
// mongoose.connect(connectionString).then(

//     //write entire logic here.
// ).catch(()=>{return "Error connecting to database. Check your network connection."})

/*
Users: {
    _id=>ObjectId
    firstname:String
    lastname:String
    email:String
    password:String(storing the hash of the password)
}
CourseCreators:{
    _id:ObjectId
    firstName:String
    lastName:String
    email:String
    password:String(storing the hash of the password)
}
Courses:{
    _id:ObjectId,
    course name:String
    course ID : String
    createdBy : ID of course creator(_id in course creator collection).
    amount:Integer
}
    Purchases:{
        _id:Object ID
        purchased By:_id of user.
        date of purchase : (Exact time including hours minutes and seconds)
        course_ID
    }
*/
// const UserSchema;
// const AdminSchema;
// const CoursesSchema;
// const PurchasesSchema;
