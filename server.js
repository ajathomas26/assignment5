/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Alexander THomas Student ID: __133475228_____ Date: __17th June 2023_______
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');
const exphbs = require('express-handlebars');

const app = express();

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main',
helpers: {
  navLink: function(url, options){
    return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
},

equal: function (lvalue, rvalue, options) {
  if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
}

}
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// Other middleware and configuration
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
  next();
});
// Custom Handlebars helper for equality comparison


// Route to get all students
// Route to get all students
app.get('/students', (req, res) => {
  collegeData.getAllStudents()
    .then(students => {
      if (students.length === 0) {
        res.render("students", { message: "no results" });
      } else {
        res.render("students", { students: students });
      }
    })
    .catch(() => {
      res.render("students", { message: "no results" });
    });
});

// Route to handle adding a new student
app.post('/students/add', (req, res) => {
  const studentData = req.body;

  collegeData.addStudent(studentData)
    .then(() => {
      res.redirect('/students');
    })
    .catch(() => {
      res.status(500).send('Error adding student');
    });
});


// Route to get students by course
app.get('/students/course', (req, res) => {
  const course = req.query.value;
  collegeData.getStudentsByCourse(course)
    .then(students => {
      if (students.length === 0) {
        res.json({ message: "no results" });
      } else {
        res.json(students);
      }
    })
    .catch(() => {
      res.json({ message: "no results" });
    });
});

// Route to get all TAs
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(tas => {
      if (tas.length === 0) {
        res.json({ message: "no results" });
      } else {
        res.json(tas);
      }
    })
    .catch(() => {
      res.json({ message: "no results" });
    });
});

// Route to get all courses
// Route to get all courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then(courses => {
      if (courses.length === 0) {
        res.render('courses', { message: "no results" });
      } else {
        res.render('courses', { courses: courses });
      }
    })
    .catch(() => {
      res.render('courses', { message: "no results" });
    });
});


// Route to get student by number
app.get('/student/:num', (req, res) => {
  const num = req.params.num;
  collegeData.getStudentByNum(num)
    .then(student => {
      if (student === null) {
        res.render('student', { message: "no results" }); // Render the "student" view with a message
      } else {
        res.render('student', { student: student }); // Render the "student" view with the student data
      }
    })
    .catch(() => {
      res.render('student', { message: "no results" }); // Render the "student" view with an error message
    });
});
// Route to get course by id
app.get("/course/:courseId", (req, res) => {
  collegeData.getStudentByNum(req.params.courseId).then((course) => {
      // res.json(data);
      res.render("course", {
          course: course,
          layout: "main"
      })
  }).catch((err) => {
      // res.json({message:"no results"});
      res.render(course, {
          message: "cannot find courses"
      })
  });
});
app.post("/student/update", (req, res) => {

  console.log(JSON.stringify(req.body))
  collegeData.updateStudent(req.body).then(()=>{
      
      res.redirect("/students")
  }).catch(err=>{
      res.send(err)
  })
});

// Route to serve home.html
app.get('/', (req, res) => {
  res.render('home');
});

// Route to serve about.html
app.get('/about', (req, res) => {
  res.render('about'); // Renders about.hbs
});

// Route to serve htmlDemo.html
app.get('/htmlDemo', (req, res) => {
  res.render('htmlDemo'); // Renders htmlDemo.hbs
});

app.get('/students/add', (req, res) => {
  res.render('addStudent'); // Renders addStudent.hbs
});


// Route for unmatched routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Initialize collegeData module
collegeData.initialize()
  .then(() => {
    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on port `);
    });
  })
  .catch((err) => {
    console.error(err);
  });
