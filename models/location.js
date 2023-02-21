var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
userLocationSchema = new Schema( {
	unique_id: Number,	
	username: String,
	lat: String,
	long: String,
	curLocation: [{lat:String,long:String}],
    count:Number
	
}),
Location = mongoose.model('Location', userLocationSchema);

module.exports = Location;