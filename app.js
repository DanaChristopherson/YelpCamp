var express = require("express");
var app = express();
var listener = app.listen(3000, function(){
	console.log("listen on port " + listener.address().port);
});

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	var campgrounds = [
		{name: "Salmon Creek", image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
		{name: "Granite Hill", image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
		{name: "Mountain Goat's Rest", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
	]

	res.render("campgrounds", { campgrounds: campgrounds });
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The YelpCamp Server has started!");
});