var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
	"username":String,
	"password":String
});

exports.User = Mongoose.model('User', UserSchema)