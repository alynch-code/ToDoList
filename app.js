const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const items = ["Code","Workout","Eat Food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  let day = date.getDate();
  res.render("lists", {
    listTitle: day,
    newListItems: items,

  })
});

app.get("/work", function(req, res) {
  res.render("lists", {
    listTitle: "Work List",
    newListItems: workItems,
  })
});

app.post("/",function(req,res){
  const item = req.body.newListItem
  if(req.body.list === "Work List"){
    workItems.push(item)
    res.redirect("/work")
  }else{
    items.push(item)
    res.redirect("/")
  }
});

app.post("/work", function(req,res){
  const item =req.body.newListItem
  workItems.push(item)
  res.redirect("/work")
});

app.listen(process.env.PORT || 8080,function(){
  console.log("Listening...")
});
