const fs = require("fs");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
      if (err) {
        reject("unable to load courses");
        return;
      }

      fs.readFile("./data/students.json", "utf8", (err, studentData) => {
        if (err) {
          reject("unable to load students");
          return;
        }

        dataCollection = new Data(
          JSON.parse(studentData),
          JSON.parse(courseData)
        );
        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.students);
  });
}

function getTAs() {
  return new Promise(function (resolve, reject) {
    var filteredStudents = [];

    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].TA == true) {
        filteredStudents.push(dataCollection.students[i]);
      }
    }

    if (filteredStudents.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredStudents);
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.courses);
  });
}

function getStudentByNum(num) {
  return new Promise(function (resolve, reject) {
    var foundStudent = null;

    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].studentNum == num) {
        foundStudent = dataCollection.students[i];
      }
    }

    if (!foundStudent) {
      reject("query returned 0 results");
      return;
    }

    resolve(foundStudent);
  });
}

function getStudentsByCourse(course) {
  return new Promise(function (resolve, reject) {
    var filteredStudents = [];

    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].course == course) {
        filteredStudents.push(dataCollection.students[i]);
      }
    }

    if (filteredStudents.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredStudents);
  });
}
function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (studentData.TA === undefined) {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }

    studentData.studentNum = dataCollection.students.length + 1;

    dataCollection.students.push(studentData);

    resolve();
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    let foundCourse = null;

    for (let i = 0; i < dataCollection.courses.length; i++) {
      if (dataCollection.courses[i].courseId === id) {
        foundCourse = dataCollection.courses[i];
        break;
      }
    }

    if (foundCourse) {
      resolve(foundCourse);
    } else {
      reject(new Error("Query returned 0 results"));
    }
  });
}
function updateStudent(studentData) {
  return new Promise(function (resolve, reject) {
    var updateCount = 0;

    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].studentNum === studentData.studentNum) {
        updateCount++;
        // Update the student data
        dataCollection.students[i].firstName = studentData.firstName;
        dataCollection.students[i].lastName = studentData.lastName;
        // ... other fields ...

        console.log("Updated student data:", dataCollection.students[i]);
        try {
          fs.writeFileSync('./data/students.json', JSON.stringify(dataCollection.students));
          console.log("JSON data is saved.");
        } catch (error) {
          console.log("Error saving data to file:", error);
          reject("Error saving data to file");
        }
        break; // Exit the loop once the matching record is updated
      }
    }

    if (updateCount === 0) {
      reject("No data to update");
    } else {
      resolve("Updated successfully");
    }
  });
}



module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentByNum,
  getStudentsByCourse,
  addStudent,
  getCourseById,
  updateStudent,
};
