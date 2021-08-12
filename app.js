//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Define Schemas (Skeleton)
const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema] //array of item schemas
};

// Create Model
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

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


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        console.log("Become as Gods!");
      })

      res.redirect("/");
    }

    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if(listName === 'Today'){
    newItem.save(); // Mongoose Shortcut to add record
    res.redirect("/");
  }

  // Item comes from a Custom List
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/"+listName);
    });
  }



});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("You shall become as god!");
        res.redirect("/");
      }
    });
  }


  // Deleting from Custom List
  else{
    List.findOneAndUpdate({name: listName},
      {$pull: {items: {_id: checkedItemId}}},
      function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }


});


app.get("/about", function(req, res){
  res.render("about");
});


app.get("/:customListName", function(req, res){

  const customListName = _.capitalize(req.params.customListName);
  // Create new Document of the List Schema

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        console.log("Shantay you stay");
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/"+customListName);
      }

      else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
