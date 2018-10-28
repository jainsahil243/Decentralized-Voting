const express = require("express");
const hbs = require("hbs");
const app=express();
const exphbs=require('express-handlebars');
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var mongo = require('mongodb');

hbs.registerPartials(__dirname + "/views");
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/views"));

//app.use(express.static(path.join(__dirname, 'views')));
//var md5 = require(‘md5’);
var crypto = require('crypto');


mongoose.connect(
  "mongodb://localhost/crypto-user",
  { useNewUrlParser: "true" }
);

const user = require("./model/user.js");
// var x=777777777777;
// var newuser={
//   fname:"test1",
//   mname:"V",
//   lname:"User",
//   adhar: crypto.createHash('md5').update(x.toString()).digest('hex'),
//   status:0
// };
// console.log(newuser);
// var newuser1=new user.user(newuser)
// newuser1.save();


app.use(bodyParser.urlencoded({ extended: true }));



app.get('/home',function(req,res)
{
  res.render('home.hbs');
});

app.get('/info',function(req,res)
{
  res.render('info.hbs');
});
app.get('/vote',function(req,res)
{
  res.render('login.hbs',{
    pagetitle:"VERIFY YOU ARE A VOTER"
  });
});

app.post("/vote",function(req,res)
{
  console.log(req.body.adhar);
  var y=req.body.adhar;
user.user.find({"adhar":crypto.createHash('md5').update(y.toString()).digest('hex')},function(err,log){
  if(log.length === 0)
  {
    console.log(log);
    console.log('not in db');
    res.render('login.hbs',{
      pagetitle:"Wrong Credentials Entered, Please Check and Try Again"
    });
  }
  else {
    console.log(log[0].status)
      if(log[0].status>0)
      {
        res.render('login.hbs',{
          pagetitle:"You have already voted"
        });        
      }
      else{
      user.user.findOneAndUpdate({"adhar":log[0].adhar},{$inc:{"status":1}},function(err,doc)
        {
          console.log(doc);
        }); 
      //console.log(log);
      console.log('in db');
      res.render('vote.hbs');
  }
}
});
});

app.listen(port, () => {
  console.log(`The server is on at ${port} port`);
});
