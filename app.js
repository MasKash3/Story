const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const day = require(__dirname + "/date.js"); //local
const _ = require("lodash");

const app = express();
// let date = day.getDate();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-jordan:J@ckalANDc0@cluster0-8ax2w.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const  item1 = new Item({name: "Welcome to your todolist"});
const  item2 = new Item({name: "Hit the + button to add a new item"});
const  item3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

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
        res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
});

app.get("/:listName", function(req, res){
  const listName = _.capitalize(req.params.listName);

  List.findOne({name: listName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //Create a new list
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + listName);
      } else{
        //show existing list
        res.render("list", {listTitle: foundList.name, newListItems:foundList.items})
      }
    }
  })
})

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({name: itemName});

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else{
    List.findOne({name: listName}, function(err, foundList){
      if(err){
        console.log(err);
      } else{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    }
    })
  }

})

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err);
        res.send("An error occured. Please check the logs");
      } else{
        console.log("Successfully deleted item.");
        res.redirect("/");
      }
    })
  } else{
//in our listName, pull from our item array, an item with an id of ...
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }

})


app.listen(3000, function() {
  console.log("Server started running on port 3000");
})
