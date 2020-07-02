const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const Schema = mongoose.Schema;
const atlasURL = "mongodb+srv://combo:combo@tasktracker.zns5o.azure.mongodb.net/toDoList?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(atlasURL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const itemsSchema = new Schema({
  name: String,
});

const listSchema = new Schema({
  name: String,
  items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const code = new Item ({
  name: "Code"
});

const workout = new Item ({
  name: "Workout"
});

const eatFood = new Item ({
  name: "Eat Food"
});

const defaultItems = [code,workout,eatFood];

app.get("/", function(req, res) {
  Item.find({}, function (error, fItems){
    if (fItems.length === 0){

      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log("check code")
        } else {
          console.log("database successfully updated!")
        }
      });
      res.redirect("/")
    }else {
      res.render("lists", {
        listTitle: day,
        newListItems: fItems,
      })
    }
    console.log(fItems)
  })
  let day = date.getDate();
});

app.get("/:listName", function(req,res){
   const listName = _.capitalize(req.params.listName);
   List.findOne({name:listName}, function(err, foundList){
     if (!err){
       if (!foundList){
         const list = new List ({
           name: listName,
           items: defaultItems
         })
         list.save();
         res.redirect("/"+listName);
       } else {
         res.render("lists", {
           listTitle: foundList.name,
           newListItems: foundList.items,
         })
       }
     }
   })
});

app.post("/",function(req,res){
  const itemName = req.body.newListItem
  const listNames = req.body.list

  const item = new Item({
    name: itemName
  })

  if (listNames === date.getDate()){
    item.save()
    res.redirect("/")
  } else {
    List.findOne({name:listNames}, function(err, foundList){
    foundList.items.push(item)
    foundList.save()
    res.redirect("/"+listNames)
  })
  }
});

app.post("/delete", function (req, res){
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName
  if (listName === date.getDate()){
    Item.findByIdAndDelete(checkedItemId, function(err){
      if (err) {
        console.log("Item was not deleted")
      }else {
        console.log("Item was successfully deleted")
        res.redirect("/")
      }
    })
  }else {
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}},function(err, foundList){
      res.redirect("/"+listName)
    })
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
