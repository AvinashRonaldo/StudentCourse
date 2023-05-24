<<<<<<< HEAD
# StudentCourse

Description : Created a simple student enrollment in courses via Rest Apis using Sequelize ORM

Steps to use : 
1.Run npm install to install required dependencies
2.Run "npm start" to start the server
3.Server listens on port 3000
4.Open browser and type "http://localhost:3000" to check whether the server is runnning

Points to note :
Application contains 2 models namely Student and Course.
There will be many to many relationship between Student and Course
Sequelize ORM is used for creating many to many association between Student and Course.
We can provide sample data for Students and Course to work on Apis by using bulkCreate() method,but I had created Rest Apis for creating Student and Courses data.

Assumptions made :

I had assumed that there will be a student login system before hand,when a student logs in he/she can register and deregister courses,So, in StudentCourse Rest Apis,
I had provided only courseId in parameters of Request URI.The studentId will be provided as part of req body since we will store student information in the form of cookies or
JWT (which is a diff topic) .


Deleting a course will remove all students who are registered in that particular course this can be done by removeStudent() method.
Deleting a student will de register he/she from his/her registered courses.

=======
# StudentCourse
>>>>>>> eff68f5d5a3e874e6a7afdc2af98435e4225e1bb
