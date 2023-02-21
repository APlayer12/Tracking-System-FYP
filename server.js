var express = require('express');
var nodemailer=require('nodemailer');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var flash = require("connect-flash");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors')




mongoose.connect('mongodb+srv://harith:harith04@cluster0.1pbiwat.mongodb.net/LocationTracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
    
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});




app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true,
  
}));

app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'customer'));



app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(cors());
app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);


app.use(flash());


// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.locals.messages = req.flash();
  res.send(err.message);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});