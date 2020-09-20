const User = require('../models/users');
const commonFormatter = require('../formatters/common.formatter');
var response = require('../response/response');
const bcrypt = require('bcryptjs');


const service = {
    updateProfile: updateProfile,
    getUserInfoByUsername: getUserInfoByUsername,
    getUsersByRole: getUsersByRole,
    filterUsers: filterUsers,
    filterUsersAndCourses: filterUsersAndCourses,
    getUserByEmail: getUserByEmail,
    CreateUserByMentor: CreateUserByMentor,
    getUserByMentor: getUserByMentor
}

module.exports = service;

function getUserInfoByUsername(req, res, next) {
    User.getUserByUsername({}, (err, user) => {
        if (err) {
            return res.send({ success: false, msg: err.message });
        } else if (!!user) {
            return res.send({ success: true, user: commonFormatter.formatUser(user) });
        } else {
            return res.send({ success: false, msg: "User not found" })
        }
    })
}

function getUserByEmail(req, res, next) {
    var params = req.body;
    var query = {}
    if (params.email) {
        query.email = params.email
    }

    User.getUserByUsername(query, (err, user) => {
        if (err) {
            response(res, null, err);
        } else {
            if (user) {
                var data = {
                    Data: user,
                    Message: "User found",
                    Other: {
                        Success: true
                    }
                }
                response(res, data, null);
            } else {
                var data = {
                    Data: {},
                    Message: "User not found",
                    Other: {
                        Success: false
                    }
                }
                response(res, data, null);
            }

        }
    })
}


function updateProfile(req, res, next) {
    var params = req.body;
    var basedOn = {
        email: params.email,
    }
    var query = {}

    if (params.firstname) {
        query.firstname = params.firstname
    }
    if (params.lastname) {
        query.lastname = params.lastname
    }
    if (params.personal) {
        query.personal = params.personal
    }
    if (params.education) {
        query.education = params.education
    }
    if (params.work) {
        query.work = params.work
    }
    if (params.mentor) {
        query.mentor = params.mentor
    }
    if (params.learningAssets) {
        query.learningAssets = params.learningAssets
    }
    if (params.social) {
        query.social = params.social
    }

    if (params.school) {
        query.school = params.school
    }

    query.profileUpdated = true;

    User.findOneAndUpdate(basedOn, { $set: query }).then(
        doc => {
            if (doc.n == 0) {
                var data = {
                    Data: doc,
                    Message: "profile updateing Failed !",
                    Other: {
                        Success: false
                    }
                }
                response(res, data, null);
            } else {
                User.findOne(basedOn).then(
                    subdoc => {
                        var data = {
                            Data: subdoc,
                            Message: "profile updated Successfully !",
                            Other: {
                                Success: true
                            }
                        }
                        response(res, data, null);
                    }, err => {
                        response(res, null, err);
                    }
                )
            }

        }, err => {
            response(res, null, err);
        }
    )


}



function getUsersByRole(req, res, next) {
    let role = req.body.role;
    let username = req.body.username || null;
    // Will send only users who will match with the given role. 
    User.getUsersByRole(role, (err, users) => {
        if (err) {
            return res.status(500).send({ success: false, msg: "Something went wrong..Please try again" });
        } else if (users) {
            let formattedUsers = users;
            if (!!username) {
                formattedUsers = users.filter((u) => u.username !== req.body.username);
            }
            formattedUsers = formattedUsers.map((fu) => commonFormatter.formatUser(fu));

            return res.status(200).send({ success: true, data: formattedUsers });
        } else {
            return res.status(200).send({ success: false, msg: "No data found", data: [] });
        }
    })
}


function filterUsers(req, res, next) {
    let query = {};

    if (req.body.role) {
        query.role = req.body.role;
    }

    if (req.body.expLevel) {
        query['work.expLevel'] = req.body.expLevel;
    }

    if (req.body.jobType) {
        query['mentor.jobType'] = req.body.jobType;
    }

    if (req.body.location) {
        query['profile.location'] = req.body.location;
    }

    if (req.body.skills) {
        // query['skills'] = req.body.skills; // It will work for one. 
        query['profile.skills'] = { "$all": req.body.skills };
    }

    if (req.body.username) {
        query['username'] = { "$ne": req.body.username };
    }


    // console.log("Query:: ",query);
    User.filterUsers(query, (err, users) => {
        if (err) {
            return res.status(500).send({ success: false, msg: "Something went wrong..Please try again" });
        } else if (users) {
            let formattedUsers = users;
            formattedUsers = formattedUsers.map((fu) => commonFormatter.formatUser(fu));

            return res.status(200).send({ success: true, data: formattedUsers });
        } else {
            return res.status(200).send({ success: false, msg: "No data found", data: [] });
        }
    })
}





function filterUsersAndCourses(req, res, next) {
    let query = {};

    if (req.body.role) {
        query.role = req.body.role;
    }


    if (req.body.searchByMentor) {
        query.$or = [{ email: { "$regex": req.body.searchByMentor, "$options": "i" } },
        { username: { "$regex": req.body.searchByMentor, "$options": "i" } },
        { firstname: { "$regex": req.body.searchByMentor, "$options": "i" } },
        { lastname: { "$regex": req.body.searchByMentor, "$options": "i" } }
        ]

    }

    if (req.body.location) {
        query['personal.location'] = { "$regex": req.body.location, "$options": "i" };
    }

    if (req.body.category) {
        query['work.designation'] = { "$regex": req.body.category, "$options": "i" };
    }

    if (req.body.keywords.length != 0) {
        var RegexKeyWordsMatch = req.body.keywords.map(function (val) {
            return new RegExp(val, 'i');
        })
        console.log(RegexKeyWordsMatch)
        query['mentor.languagesTeach'] = { $elemMatch: { language: { "$in": RegexKeyWordsMatch } } }
    }

    if (req.body.Skills.length != 0) {
        var RegexKeyWordsMatch = req.body.Skills.map(function (val) {
            return new RegExp(val, 'i');
        })
        console.log(RegexKeyWordsMatch)
        query['mentor.languagesTeach'] = { $elemMatch: { language: { "$in": RegexKeyWordsMatch } } }

        // query['education.skills'] = { "$in": RegexKeyWordsMatch }
    }

    if (req.body.username) {
        query['username'] = { "$ne": req.body.username };
    }

    console.log("filters==>", query);
    User.aggregate([
        {
            $match: query,

        }
    ]).then(
        doc => {
            var data = {
                Data: doc,
                Message: "Menters list",
            }
            response(res, data, null);
        }, err => {
            response(res, null, err);
        }
    )

    // console.log("Query:: ", query);
    // User.filterUsers(query, (err, doc) => {
    //     if (err) {
    //         response(res, null, err);
    //     } else {
    //         var data = {
    //             Data: doc,
    //             Message: "Menters list",
    //         }
    //         response(res, data, null);
    //     }
    // })



}



function CreateUserByMentor(req, res, next) {
    var params = req.body;

    var query = {}
    query.email = params.email;
    query.username = params.username;
    query.role = params.role;

    if (params.firstname) {
        query.firstname = params.firstname
    }
    if (params.lastname) {
        query.lastname = params.lastname
    }
    if (params.personal) {
        query.personal = params.personal
    }
    if (params.education) {
        query.education = params.education
    }
    if (params.work) {
        query.work = params.work
    }
    if (params.mentor) {
        query.mentor = params.mentor
    }
    if (params.learningAssets) {
        query.learningAssets = params.learningAssets
    }
    if (params.social) {
        query.social = params.social
    }

    if (params.school) {
        query.school = params.school
    }

    query.profileUpdated = true;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(params.password, salt, function (err, hash) {
            if (err) {
                response(res, null, err);
            } else {
                query.password = hash;

                var inputFields = new User(query);

                try {
                    inputFields.save().then(
                        doc => {
                            var data = {
                                Data: doc,
                                Message: "Student Created Successfully !",
                            }
                            response(res, data, null);
                        }, err => {
                            response(res, null, err);
                        }
                    )

                } catch (err) {
                    response(res, null, err);
                }


            }
        })
    })

}


function getUserByMentor(req, res, next) {
    var params = req.body;

    var query = {};

    query['school.mentor'] = params.mentor;

    try {
        User.find(query, { email: 1, username: 1, firstname: 1, lastname: 1, role: 1, profilePic: 1, personal: 1 }).then(
            doc => {
                var data = {
                    Data: doc,
                    Message: "Mentor Created Users",
                }
                response(res, data, null);
            }, err => {
                response(res, null, err);
            }
        )
    } catch (err) {
        response(res, null, err);
    }

}









