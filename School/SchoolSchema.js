var mongoose = require('mongoose');
var schema = mongoose.Schema;

var Schools = new schema({
    Email: {
        type: String,
        unique: true
    },
    Password: {
        type: String
    },
    SchoolName: {
        type: String
    },
    Image: {
        type: String
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    Date: {
        type: Date,
        default: Date.now()
    }
})



module.exports = mongoose.model('Schools', Schools);

