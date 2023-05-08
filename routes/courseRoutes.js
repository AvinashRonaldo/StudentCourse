const express = require('express');
const router  = express.Router();
const { Student,Course } = require('../models/student');
const { isAdmin, isAuthenticated } = require('../Middleware/auth');
require('dotenv').config();

//get List of Courses
router.get("/courses",isAuthenticated,async(req,res)=> {
    try{
    const courses = await Course.findAll({include:[
            {
                model: Student,
                required:false,
                attributes:["student_id","student_name","student_email"],
                through:{ attributes: []},
            }
            ]
        });
        res.send(courses);
    }catch(err){
    console.log(err);
    }
})
// Add a new course to list of courses present
router.post("/course",isAdmin,async(req,res)=> {
    try{
        const course = await Course.findOne({where : {course_name : req.body.course_name}})

        if(course){
        res.status(404).send("A Course with that name already exists");
        return;
        } else{
        const newCourse = await Course.create(req.body);

        res.send("course added successfully");
        }
    }
    catch(err){
        console.log(err);
    }
})
//Delete a course
router.delete("/courses/:courseId",isAuthenticated,async(req,res) => {
    try{
        const {courseId} = req.params;
        const course = await Course.findByPk(courseId,{
            include:[{model : Student}]
        });

        if(!course){
            res.status(404).send("Course not present");
            return;
        }

        await course.removeStudent(course.Students)
        await course.destroy();
        res.send("Course deleted successfully and registered students are de registered")
    }catch(err){
        console.log(err);
    }
})

//Student Course Apis

// Enroll a student for a course
router.post('/courses/:courseId/register',isAuthenticated,async(req,res) => {
    const { courseId } = req.params;
    const { student_id } = req.body;
  
    const course = await Course.findByPk(courseId);
    const student = await Student.findByPk(student_id);
  
    if (!course || !student) {
      res.status(404).json({ error: 'Course or student not found' });
      return;
    }
    //Add student to course
    await course.addStudent(student);
    res.send('Student registered for course' );
  });

// De-Register a course that is registered by a student
router.delete('/courses/:courseId/deregister',isAuthenticated,async(req,res) => {
    try{
    const { courseId } = req.params;
    const { studentId } = req.body;
  
    const course = await Course.findByPk(courseId);
    const student = await Student.findByPk(studentId);
  
    if (!course || !student) {
      res.status(404).json({ error: 'Course or student not found' });
      return;
    }
  
    //remove the student from course registered
    const result = await course.removeStudent(student);
    if (result === 0) {
      res.status(404).json({ error: 'Student is not registered for course' });
      return;
    }

    res.json('Course removed from student courses list' );
    }catch(err){
        console.log(err);
    }
  });

module.exports = router;