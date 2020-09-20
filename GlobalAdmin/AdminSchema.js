var mongoose = require('mongoose');
var schema = mongoose.Schema;

var GlobalAdmin = new schema({
    Email: {
        type: String,
        unique: true
    },
    Password: {
        type: String
    },
    AdminName: {
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



module.exports = mongoose.model('GlobalAdmin', GlobalAdmin);

