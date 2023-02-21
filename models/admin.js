var bycrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminInfoSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String,
	role: String,
	
}),
Admin = mongoose.model('Admin', adminInfoSchema);

module.exports = Admin, adminInfoSchema;