var Admin = require('./AdminSchema');
var response = require('../response/response');

var datacrtl = {};



datacrtl.AddAdmin = (req, res, next) => {
    var params = req.body;
    var query = {
        Email: params.Email,
        Password: params.Password,
        AdminName: params.AdminName,
        Image: params.Image
    }
    var inputFields = new Admin(query);
    inputFields.save().then(
        doc => {
            var data = {
                Data: doc,
                Message: "School added successfully",
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )
}


datacrtl.getAdmin = (req, res, next) => {
    var params = req.body;
    var query = {};

    if (params.Email) {
        query.Email = params.Email
    }

    Admin.find(query).then(
        doc => {
            var data = {
                Data: doc,
                Message: "Admins",
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )
}



datacrtl.updateAdmin = (req, res, next) => {
    var params = req.body;
    var basedOn = {
        Email: params.Email,
    }
    var query = {}
    if (params.Password) {
        query.Password = params.Password
    }
    if (params.AdminName) {
        query.AdminName = params.AdminName
    }
    if (params.Image) {
        query.Image = params.Image
    }
    if (params.IsActive) {
        query.IsActive = params.IsActive
    }

    Admin.update(basedOn, { $set: query }).then(
        doc => {
            if (doc.n == 0) {
                var data = {
                    Data: doc,
                    Message: "Admin updating Failed !",
                    Other: {
                        Success: false
                    }
                }
            } else {
                var data = {
                    Data: doc,
                    Message: "Admin updated Successfully !",
                    Other: {
                        Success: true
                    }
                }
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )

}


datacrtl.deleteAdmin = (req, res, next) => {
    var params = req.body;
    var query = {
        Email: params.Email,
        Password: params.Password
    }
    Admin.findOneAndDelete(query).then(
        doc => {
            if (doc.n == 0) {
                var data = {
                    Data: doc,
                    Message: "Admin Deleting Failed !",
                    Other: {
                        Success: false
                    }
                }
            } else {
                var data = {
                    Data: doc,
                    Message: "Admin Deleted Successfully !",
                    Other: {
                        Success: true
                    }
                }
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )

}


module.exports = datacrtl;