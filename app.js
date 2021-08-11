//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Define Schema (Skeleton)
const itemSchema = {
  name: String
};

// Create Model
const Item = mongoose.model("Item", itemSchema);

// Populate Model
const amanda = new Item({
  name: "Amanda"
});

const projectAmaani = new Item({
  name: "Amaani"
});

const america = new Item({
  name: "America"
});

const defaultItems = [amanda, projectAmaani, america];

Item.find({}, function(err, foundItems){
  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
      console.log("Become as Gods!");
    })
  }

  else{
    console.log("default items already present");
  }
});


app.get("/", function(req, res) {

  res.render("list", {listTitle: "Today", newListItems: defaultItems});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
