var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Location = require ('../models/location');
var Admin = require ('../models/admin')
var db = require ('../server');

let {session} = require('passport');
const { decodeBase64 } = require('bcryptjs');
const userInfoSchema = require ('../models/user');



/* USER  */

router.get('/', function (req, res, next) { //Homepage
	return res.render('index.ejs');
});


router.get('/regLogin', function (req, res, next) { //Register & Login render
	res.render("customer/regLogin.ejs");
});


router.post('/regLogin', function(req, res, next) { //Register
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf ){
		res.send();
	} else {
		
		if (personInfo.password == personInfo.passwordConf) {
			
			User.findOne({$or:[{username:personInfo.username}, {email:personInfo.email}] },function(err,data) {
	
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							number: personInfo.number,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
							lat: 0,
							long: 0,
							role: "admin",
							
							
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"Registered,You can login now."});
					}else{
					res.send({"Success":"Email or username is already used."});
			
				}

			});
		}else{
			res.send({"Success":"Password is not matched"});;
		}
	}
});


router.post('/login', function (req, res, next) { //Login
	console.log(req.body);

	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				req.session.userID = data.unique_id;
				session = req.session;
				res.render("customer/data");
			}else{
				
				res.render("customer/regLogin",{message:"Wrong password"});
			}
		}else{
			
			res.render("customer/regLogin",{message:"Email not registered"});
		}
	});
});


router.get('/forget', function (req, res, next) { //Forget password render
	res.render("customer/forget.ejs");
});


router.post('/forget', function (req, res, next) { //Forget password
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});


router.get('/user', function (req, res, next) { //User Details
	console.log("user");
	session;
	User.findOne({unique_id:session.userID},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			Location.find({unique_id:session.userID}).sort({count:-1}).limit(1).exec(function(err,data2){
				console.log("data2");
				console.log(data2);
				return res.render('customer/user.ejs', {"name":data.username,"email":data.email, "id":data.unique_id, "latitude":data.lat, "longitude":data.long, "FLatitude":data2[0].lat, "FLongitude":data2[0].long });
			})
			
		}
	});

	// Location.findOne({unique_id:session.userID},function(err,data2){
	// 	console.log("data2")
	// 	console.log(data2);
	// })
	
	
});


router.get('/logout', function (req, res, next) { //logout
	console.log("logout")
	if (req.session) {
	// delete session object
	req.session.destroy(function (err) {
		if (err) {
			return next(err);
		} else {
			return res.redirect('/');
		}
	});
}
});


router.get('/userUpdate', function (req, res, next) { //Homepage
	console.log("user");
	session;
	User.findOne({unique_id:session.userID},function(err,data){
		console.log("data");
		console.log(data);

		if(!data){
			res.redirect('/');
		}else{
			let validemail = false
			let validusername = false

			// if(!User.findOne({email:req.body.email})){
			// 	validemail=true;
			// 	data.email = req.body.email;
			// 	res.send({"Success":"Changed"});	
			// }else{
			// 	console.log("email already exists")
			// 	res.send({"Success":"Email already registered"})
			// }
			// if(!User.findOne({username:req.body.username})){
			// 	validusername=true;
			// 	data.username = req.body.username;
			// 	res.send({"Success":"Changed"});
			// }else{
			// 	console.log("username already exists")
			// 	res.send({"Success":"Username already registered"})
			// }
			
			return res.render('customer/userUpdate.ejs', {"name":data.username,"email":data.email, "id":data.unique_id});
			
			
		}

	


	});

	

});

router.post('/userUpdate', function (req, res, next) { //Homepage
	console.log("user");
	session;
	// User.findOne({unique_id:session.userID},function(err,data){
	// 	console.log("data");
	// 	console.log(data);

	// 	if(!data){
	// 		res.redirect('/');
	// 	}else{
	// 		let validemail = false
	// 		let validusername = false

	// 		if(!User.findOne({email:req.body.email})){
	// 			validemail=true;
	// 			data.email = req.body.email;
	// 			res.send({"Success":"Changed"});	
	// 		}else{
	// 			console.log("email already exists")
	// 			res.send({"Success":"Email already registered"})
	// 		}
	// 		if(!User.findOne({username:req.body.username})){
	// 			validusername=true;
	// 			data.username = req.body.username;
	// 			res.send({"Success":"Changed"});
	// 		}else{
	// 			console.log("username already exists")
	// 			res.send({"Success":"Username already registered"})
	// 		}
			
		
			
			
	// 	}
	// });

	User.findOne({unique_id:session.userID},function(err,data){
		if (data){
			data.email = req.body.email;
			data.username = req.body.username;
			data.save();
			console.log("Update success");
		}
	})
	

});


/* INDEX  */

router.get('/data', function (req, res, next) { //Index page render
	res.render("customer/data.ejs");
});




/* MAP */

router.get('/Map', function (req, res, next) { //Map render
	User.findOne({unique_id:session.userID}).populate("friends").exec (function(err,data){
	
	return res.render('customer/Map.ejs',{user:data});
	})
});




router.post('/Map', function (req, res, next) { //Map

	console.log(req.body);
	var locationInfo = req.body;
	lat=locationInfo.lat;
	long=locationInfo.long;
	console.log(lat,",",long);

	User.findOne({unique_id:req.session.userID},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"location not entered yet"});
		}else{
			if (locationInfo.lat != 0 && locationInfo.long != 0) {
				data.lat=locationInfo.lat;
				data.long=locationInfo.long;

				data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
				});

				var latitude,longitude
				console.log("sini1");
				latitude= parseFloat(lat).toFixed(2);
				longitude= parseFloat(long).toFixed(2);

				latitude=latitude.toString();
				longitude=longitude.toString();


			
			

				Location.findOne({unique_id:session.userID, lat:latitude, long:longitude},function(err,data2){
						if(!data2){
							console.log("sini2");
								
								let count  = 0 
								var newLocation = new Location({
									unique_id:data.unique_id,
									username:data.username,
									lat:latitude,
									long:longitude,
									count
								})
								newLocation.save()
							}else{
							
								console.log("sini3");
								data2.count = data2.count+1;
								data2.save()
								res.send()
							
							}			
			
				})
			
					
			}
			else{			
				res.send({"Success":"bla"});
			}
		}
	});	
});




/* USER SEARCH */

router.get('/search', async function(req,res,next){ //Search other users render
	session;


	User.findOne({unique_id:session.userID}).populate("friends").exec(function (err,data){
		console.log("data");
		console.log(data);
		if(data){
			
			Location.find({username:data.username}).sort({count:-1}).limit(1).exec(function(err,data2){
				console.log("data2");
				console.log(data2);
				return res.render('customer/search.ejs',{user:data,"FLatitude":data2[0].lat,"FLongitude":data2[0].long});
			})
		
		}else{
			
				return res.render('customer/search.ejs');
		
		}
		
	})	

	// User.find({},function(err,data){
	// 	if(data){
	// 		return res.render('customer/search.ejs',{users:data,session})
	// 	}else{
	// 		return res.render('customer/search.ejs')
	// 	}
	// })
	
});
	
	
router.post('/search', function (req, res, next) { //Search other users

	



		if(req.body.search!="" || req.body.search != session.userID) {
			User.findOne({username:req.body.search},function(err, data){
				if(data) {
					res.json({status:"success",message:"found", name:data.username, username:data.unique_id}, )
				}
				else {
					res.json({status:"fail",message:"not found"})
				}
			})
		}
		else {
			res.json({status:"fail",message:"not found"})
		}
});



		





/* ADD FRIEND */

router.post("/addfriend/:friendID", async function(req,res,next){ //Send to pending friends
	session;
	userID = session.userID
	var friendID = req.params.friendID;
	 var FriendInfo= req.body;

	User.findOne({unique_id:session.userID}, function (err,data){
		
		User.updateOne({unique_id: friendID}, { $push: { pendingFriends: data._id}}, (err,result) => {
		console.log(err, result);
		
		res.redirect("/search");
		 

		})
	
	})	

});
	

router.get("/request", function (req, res) { //Pending friends page
	session;
	userID = session.userID
	console.log(session.username);

	User.findOne({unique_id:session.userID}).populate("pendingFriends").exec(function (err,data){
		console.log(data);
		return res.render('customer/requested.ejs',{user:data});
	})	
});


router.post("/accept", function (req,res){ //Accept button
	session;
	console.log(req.body.accepted)
	
	User.findOne({unique_id:session.userID}, function(err, data){

	
			User.updateOne({unique_id: session.userID}, { $pull: { pendingFriends:{$eq: req.body.accepted}}}, (err,result) => {
				User.updateOne({unique_id: session.userID}, { $push: { friends:req.body.accepted}}, (err,result) => {
					User.updateOne({_id:req.body.accepted}, { $push: { friends:data._id}}, (err,result) => {
						console.log(err, result)
						res.json(result)
					})
				})
			})
		})
});

router.post("/reject", function (req,res){ //Reject button
	session;
	console.log(req.body.rejected)
	
	User.findOne({unique_id:session.userID}, function(err, data){

	
		User.updateOne({unique_id: session.userID}, { $pull: { pendingFriends:{$eq: req.body.rejected}}}, (err,result) => {
			User.updateOne({unique_id: session.userID}, { $pull: { friends:req.body.accepted}}, (err,result) => {
				User.updateOne({_id:req.body.accepted}, { $pull: { friends:data._id}}, (err,result) => {
					console.log(err, result)
					res.json(result)
				})
			})
		})
	})
});



/* ADMIN */

router.get('/adminLogin', function (req, res, next) { //Admin index page
	res.render("admin/adminLogin.ejs");
});

router.get('/adminReg', function (req, res, next) { //Admin index page
	res.render("admin/adminReg.ejs");
});

router.post('/adminReg', function(req, res, next) { //Register
	console.log(req.body);
	var adminInfo = req.body;


	if(!adminInfo.email || !adminInfo.username || !adminInfo.password || !adminInfo.passwordConf ){
		res.send();
	} else {
		
		if (adminInfo.password == adminInfo.passwordConf) {
			
			Admin.findOne({$or:[{username:adminInfo.username}, {email:adminInfo.email}] },function(err,data) {
	
				if(!data){
					var c;
					Admin.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new Admin({
							unique_id:c,
							email:adminInfo.email,
							username: adminInfo.username,
							password: adminInfo.password,
							passwordConf: adminInfo.passwordConf,
							role: "admin",
							
							
						});

						newPerson.save(function(err, Admin){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"Registered,You can login now."});
					}else{
					res.send({"Success":"Email or username is already used."});
			
				}

			});
		}else{
			res.send({"Success":"Password is not matched"});;
		}
	}
});

router.post('/adminLogin', function (req, res, next) { //Login
	console.log(req.body);
	Admin.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				req.session.userID = data.unique_id;
				session = req.session;
				res.redirect("/adminHome");
			}else{
				
				res.render("admin/adminLogin",{message:"Wrong password"});
			}
		}else{
			
			res.render("admin/adminLogin",{message:"Email not registered"});
		}
	});
});

router.get('/adminHome', function (req, res, next) { //Admin index page
	console.log("user");
	User.find(function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			return res.render('admin/adminHome.ejs', {users:data});
		}
	});
});

router.get('/adminLogout', function (req, res, next) { //logout
	console.log("logout")
	if (req.session) {
	// delete session object
	req.session.destroy(function (err) {
		if (err) {
			return next(err);
		} else {
			return res.redirect('/adminLogin');
		}
	});
}
});





// router.get('/adminHome/:id', function (req, res) {
// 	var id = req.params.id;
// 	User.findOne({
// 		_id: id
// 	}, function (err, data) {
// 		if (data) {
// 			res.render('admin/adminHome.ejs', {
// 				data
// 			});
// 		}
// 	})
// })

module.exports = router;