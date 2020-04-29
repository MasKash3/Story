const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const day = require(__dirname + "/date.js"); //local

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "Please give a name"]
  }
};

const Item = mongoose.model("Item", itemsSchema);

const  item1 = new Item({name: "Welcome to your todolist"});
const  item2 = new Item({name: "Hit the + button to add a new item"});
const  item3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {
  let date = day.getDate();

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else{
          console.log("Documents successfully added.");
        }
      });
      res.redirect("/");
    }else{
        res.render("list", {listTitle: date, newListItems: foundItems});
    }
  })
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const  newItem = new Item({name: itemName});

  newItem.save();

  res.redirect("/");

})


app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})


app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
})


app.listen(3000, function() {
  console.log("Server started running on port 3000");
})
