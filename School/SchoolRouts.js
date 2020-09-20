var school = require('./SchoolCtrl');

module.exports = (app) => {
    app.post('/addSchool', school.AddSchool);
    app.post('/getSchools', school.getSchool);
    app.post('/updateSchool', school.updateSchool);
    app.post('/deleteSchool', school.deleteSchool);

}