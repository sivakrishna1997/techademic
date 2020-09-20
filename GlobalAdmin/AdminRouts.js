var Admin = require('./AdminCtrl');

module.exports = (app) => {
    app.post('/addAdmin', Admin.AddAdmin);
    app.post('/getAdmins', Admin.getAdmin);
    app.post('/updateAdmin', Admin.updateAdmin);
    app.post('/deleteAdmin', Admin.deleteAdmin);

}