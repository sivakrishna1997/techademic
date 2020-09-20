var School = require('./SchoolSchema');
var response = require('../response/response');

var datacrtl = {};



datacrtl.AddSchool = (req, res, next) => {
    var params = req.body;
    var query = {
        Email: params.Email,
        Password: params.Password,
        SchoolName: params.SchoolName,
        Image: params.Image
    }
    var inputFields = new School(query);
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


datacrtl.getSchool = (req, res, next) => {
    var params = req.body;
    var query = {};

    if (params.Email) {
        query.Email = params.Email
    }

    School.find(query).then(
        doc => {
            var data = {
                Data: doc,
                Message: "Schools",
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )
}



datacrtl.updateSchool = (req, res, next) => {
    var params = req.body;
    var basedOn = {
        Email: params.Email,
    }
    var query = {}
    if (params.Password) {
        query.Password = params.Password
    }
    if (params.SchoolName) {
        query.SchoolName = params.SchoolName
    }
    if (params.Image) {
        query.Image = params.Image
    }
    if (params.IsActive) {
        query.IsActive = params.IsActive
    }

    School.update(basedOn, { $set: query }).then(
        doc => {
            if (doc.n == 0) {
                var data = {
                    Data: doc,
                    Message: "School updating Failed !",
                    Other: {
                        Success: false
                    }
                }
            } else {
                var data = {
                    Data: doc,
                    Message: "School updated Successfully !",
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


datacrtl.deleteSchool = (req, res, next) => {
    var params = req.body;
    var query = {
        Email: params.Email,
        Password: params.Password
    }
    School.findOneAndDelete(query).then(
        doc => {
            if (doc.n == 0) {
                var data = {
                    Data: doc,
                    Message: "School Deleting Failed !",
                    Other: {
                        Success: false
                    }
                }
            } else {
                var data = {
                    Data: doc,
                    Message: "School Deleted Successfully !",
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