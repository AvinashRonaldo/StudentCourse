const express = require('express');
const http = require('http');
const sequelize = require('./database');
const morgan = require('morgan');
const app = express();
const {Student,Course,StudentCourse} = require('./models/student');
const studentRoutes = require('./routes/studentRoute')
const courseRoutes = require('./routes/courseRoutes')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('dev'));

app.get("/",(req,res)=> {
    res.send("Welcome to sample Website");
})

const server = http.createServer(app);
server.listen(3000,()=> {
    console.log("Server up and Runnning");
})

//Student Rest Apis
app.use(studentRoutes);

//Courses Api
app.use(courseRoutes);

  
  

