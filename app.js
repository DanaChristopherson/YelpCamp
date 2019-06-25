var express = require("express");
	 app = express();
	 bodyParser = require("body-parser");
	 mongoose = require("mongoose");
	 Campground = require("./models/campground");
	 seedDB = require("./seeds");
	 Comment = require("./models/comment");


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

seedDB();

// Original code for seeding a test campground
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




app.get("/", function(req, res){
	res.render("landing");
});

// INDEX ROUTE
app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", { campgrounds:allCampgrounds});
		}
	});
	
});

// CREATE ROUTE
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

//NEW ROUTE
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ==================================
// COMMENTS ROUTE
// ==================================

app.get("/campgrounds/:id/comments/new", function(req, res){
		//find campground by id
		Campground.findById(req.params.id, function(err, campground){
			if(err){
				console.log(err);
			} else {
				res.render("comments/new", {campground: campground});
			}
		});
});

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to campground
	//redirect campground show page
});


app.listen(3000, process.env.IP, function(){
	console.log("The YelpCamp Server has started!");
});