const path = require("path");
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const errorController = require("./controllers/error");
const User = require("./models/user");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById('66393840a952c147139ff19f')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose.connect('mongodb+srv://sashamaksyutenko:7Alm9KVFRzXGBjzR@cluster0.jevii2h.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
  .then(result=>{
    User.findOne().then(user=>{
      if(!user){
        const user=new User({
          name:'Sasha',
          email:'sasha@test.com',
          cart:{
            items:[]
          }
        });
        user.save();
      }
    })
    app.listen(3000);
  }).catch(err=>{console.log(err)});
