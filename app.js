const express = require('express');
const http = require('http');
const sequelize = require('./database');
const app = express();
const {Student,Course,StudentCourse} = require('./models/student');



app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=> {
    res.send("Welcome to sample Website");
})

const server = http.createServer(app);
server.listen(3000,()=> {
    console.log("Server up and Runnning");
})

//Student Rest Apis
app.get("/students",async(req,res) => {
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

app.get("/students/:studentId",async(req,res) => {
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
app.post("/student",async(req,res) => {
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
app.delete("/students/:studentId",async(req,res) => {
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

//Courses Api

//Get list of courses
app.get("/courses",async(req,res)=> {
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
app.post("/course",async(req,res)=> {
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
app.delete("/courses/:courseId",async(req,res) => {
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
app.post('/courses/:courseId/register',async(req,res) => {
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
app.delete('/courses/:courseId/deregister', async(req,res) => {
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
  
  

