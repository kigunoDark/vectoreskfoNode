var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



// User Schema
var MarkerSchema = mongoose.Schema({
	eventName: {
		type: String,
		index:true
	},
	eventDesc: {
		type: String
	},
	eventTime: {
		type: String
	}	
});

var Marker = module.exports = mongoose.model('Marker', MarkerSchema);

module.exports.createMarker = function(newMarker, callback){
	newMarker.save(callback);
}


module.exports.getBymarker = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getMarkerById = function(id, callback){
	User.findById(id, callback);
}