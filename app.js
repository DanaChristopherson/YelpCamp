var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect('mongodb+srv://Dana:u_-3KifVHx9fb6-@cluster0-bg4wh.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
	console.log('connected to db!');
}).catch(err => {
    console.log('error:', err.message);
});	

//Schema Setup
var campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Granite Hill",
// 		image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
// 		description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
// 	}, 
// 	function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED CAMPGROUND: ");
// 			console.log(campground);
// 	}
// });


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", { campgrounds:allCampgrounds});
		}
	});
	
});

app.post("/campgrounds", function(req, res){
	// get data from form and add to a campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image:image, description:description}
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, process.env.IP, function(){
	console.log("The YelpCamp Server has started!");
});