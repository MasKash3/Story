const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname + "/date.js"); //local

const app = express();

let items = ["Buy Food", "Cook Food", "Eat food"];
let workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  let date = day.getDate();

  res.render("list", {listTitle: date, newListItems: items});

});

app.post("/", function(req, res){
  let item = req.body.newItem;
//only takes first word if having a space
  if(req.body.list === "Work"){

    workItems.push(item);
    res.redirect("/work");

  } else{

    items.push(item);
    res.redirect("/");

  }
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
