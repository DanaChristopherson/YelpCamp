var express 		 = require("express");
	app 			 = express();
	bodyParser 		 = require("body-parser");
	mongoose 		 = require("mongoose");
	flash            = require("connect-flash"),
	passport 		 = require("passport");
	LocalStrategy 	 = require("passport-local");
	Campground 		 = require("./models/campground");
	Comment 		 = require("./models/comment");
	User 			 = require("./models/user")
	seedDB 			 = require("./seeds");
	methodOverride   = require("method-override");
	
// Requiring Routes	
var commentRoutes    = require("./routes/comments");
	campgroundRoutes = require("./routes/campgrounds");
	indexRoutes   	 = require("./routes/index");

const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
});

mongoose.connect('mongodb+srv://Dana:u_-3KifVHx9fb6-@cluster0-bg4wh.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
	console.log('connected to db!');
}).catch(err => {
    console.log('error:', err.message);
});	

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//require moment
app.locals.moment = require('moment');
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is a secret message!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//app.listen(3000, process.env.IP, function(){
	//console.log("The YelpCamp Server has started!");
app.listen(port,() => {
  console.log(`Server running at port `+port);
});
