const express = require('express');
const router  = express.Router();
const { Student,Course } = require('../models/student');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { isAdmin, isAuthenticated} = require('../Middleware/auth');
const sequelize = require('../database');
const { QueryTypes } = require('sequelize');

router.post("/login",async(req,res) => {
    try{
    const uname = req.body.student_name;
    const pass = req.body.password;
    const [student,metadata ] = await sequelize.query('SELECT student_id,student_name,student_email,password,isAdmin from students where student_name=?',{
        replacements:[uname],type: QueryTypes.SELECT
    });
    if(!student){
        return res.status(400).send({message:"No user found with that credentials"});
    }
    if(student.password != pass){
        res.status(404).json({message : "Invalid Credentials"});
    }
    else{
        const IsAdmin = student.isAdmin;
        const payload = {
            uname,
            IsAdmin
        }
        const token = jwt.sign(payload,process.env.SECRET_KEY);
        res.send(token);
    }
    }catch(err){
        console.log(err);
    }
});

router.get("/students",isAuthenticated,isAdmin,async(req,res) => {
    try{
    const students = await Student.findAll({
        include:[
            {
                model: Course,
                attributes:["course_id","course_name"],
                through:{ attributes:[]}
            }
        ]
    });
    const data = students;
    res.send(data);
    } catch(err){
        console.log(err);
    }
})
//Get single student info
router.get("/students/:studentId",isAuthenticated,async(req,res) => {
    try{
    const { studentId } = req.params;
    const student = await Student.findByPk(studentId,{
        include:[
            {
                model: Course,
                required:false,
                attributes:["course_id","course_name"],
                through:{ attributes: []}
            }
        ]
    });
    res.send(student);
    } catch(err){
        console.log(err);
    }
})
//Create a Student
router.post("/signup",async(req,res) => {
    try{
    const student = await Student.findOne({where : {student_name : req.body.student_name}})
    if(student){
        res.status(404).send("A Student with that name already exists");
        return;
    }else {
        const newStudent = await Student.create(req.body);
        res.send(newStudent);
    }
}
    catch(err){
        console.log(err);
    }
})

//Delete a student 
router.delete("/students/:studentId",async(req,res) => {
    try{
        const {studentId} = req.params;
        const student = Student.findByPk(studentId);

        if(!student){
            res.status(404).send("Student not found!");
            return;
        }

        const result = await student.setCourses([]);
        await student.destroy();
        res.send("Student deleted and registered courses are unregistered")
    }catch(err){
        console.log(err);
    }
})

module.exports = router;