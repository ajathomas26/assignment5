const collegeData = require('./collegeData');

collegeData.initialize()
  .then(() => {
    console.log('Initialization successful');
    // Continue with the rest of the assignment, test other functions
    collegeData.getAllStudents()
      .then((students) => {
        console.log(`Successfully retrieved ${students.length} students`);
      })
      .catch((error) => {
        console.error(error);
      });

    collegeData.getCourses()
      .then((courses) => {
        console.log(`Successfully retrieved ${courses.length} courses`);
      })
      .catch((error) => {
        console.error(error);
      });

    collegeData.getTAs()
      .then((TAs) => {
        console.log(`Successfully retrieved ${TAs.length} TAs`);
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error('Initialization failed:', error);
  });
