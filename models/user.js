var bycrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userInfoSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	number: String,
	password: String,
	passwordConf: String,
	lat: String,
	long: String,
	role: String,
	pendingFriends:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
	friends:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
	
}),
User = mongoose.model('User', userInfoSchema);

module.exports = User, userInfoSchema;