const { Model,DataTypes } = require('sequelize');
const sequelize = require('../database');

//class Student extends Model{}
//class Course extends Model{}

const Student = sequelize.define("student",{
    student_id : {
        type : DataTypes.UUID,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4
    },
    student_name : {
        type : DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    student_email : {
        type : DataTypes.TEXT,
        allowNull:true
    }
},
{
    "timestamps":false,
})

const Course = sequelize.define('course',{
    course_id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4

    },
    course_name : {
        type : DataTypes.STRING,
        unique:true,
        allowNull:false
    }
},{
    "timestamps":false,
})

const StudentCourse = sequelize.define('StudentCourse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue:1,
      autoIncrement:true,
      allowNull: false
    }
    },
    {
        "timestamps":false
    }
);


sequelize.sync().then(()=> {
    console.log("Db and tables sync success")
}).catch((err)=> {
    console.log(err);
});

Student.belongsToMany(Course,{through:StudentCourse,onDelete:'cascade'});
Course.belongsToMany(Student,{through:StudentCourse,onDelete:'cascade'});

module.exports = { Student,Course,StudentCourse };

