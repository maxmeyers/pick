var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
	"username":String,
	"password":String,
	"genres":Array,
	"skips":Array
});

exports.User = Mongoose.model('User', UserSchema)