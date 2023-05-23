const express = require('express');
const http = require('http');
const sequelize = require('./database');
const morgan = require('morgan');
const app = express();
const cluster = require('cluster');
const {fork} = require('child_process');
const os  = require('os');
const limitter = require('express-rate-limit');
const {Student,Course,StudentCourse} = require('./models/student');
const studentRoutes = require('./routes/studentRoute')
const courseRoutes = require('./routes/courseRoutes')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('dev'));

app.get("/",(req,res)=> {
    res.send("Welcome to sample Website");
})
const numCpus=os.cpus().length;

if(cluster.isMaster){
    for(let i=0;i<numCpus;i++){
        cluster.fork();
    }
} else {
    const server = http.createServer(app);
    server.listen(3000,()=> {
      console.log(`Server is up at ${process.pid} and Runnning`);
    });
}

app.use(limitter({
    windowMs:5000,
    max:30
}))

//server.listen(3000,()=> {
//    console.log("Server up and Runnning");
//})

//Student Rest Apis
app.use(studentRoutes);

//Courses Api
app.use(courseRoutes);

  
  

