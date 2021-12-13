const express = require('express');
const bodyParser = require('body-parser');
const app  =express();
const mon=require('mongoose')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path =require('path');
const db= require("./db");
const user =require("./models/user");
const bcrypt =require('bcrypt');
const { updateOne } = require('./models/user');



    app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'index.html'));
    });
    app.get('/register',(req,res)=>{
        res.sendFile(path.join(__dirname,'pass.html'));
    });
 app.post("/user", (req, res, next) => { 
     
      res.sendFile(path.join(__dirname,'user.html'));
 });


 app.post("/submit", (req, res, next) => {

    if(req.body.password==" "&& req.body.name==" "){
        return res.status(500).json({
           message:"Make sure there isn't any empty field"
          });
    }
 else if(req.body.password==""|| req.body.name==""){
        return res.status(500).json({
           message:"Make sure there isn't any empty field"
          });
    }
else{
        user.find({type:req.body.type ,name:req.body.name,pass:req.body.password}).exec()
        .then(user=> {
            if (user.length > 0 && req.body.type=='admin'  ) {
                  res.sendFile(path.join(__dirname,'admin.html'))
               
              } 
            else if (user.length > 0 && req.body.type=='user'  ) {
                res.sendFile(path.join(__dirname,'user.html'))
             
             }
            else {
                 
                  res.sendFile(path.join(__dirname,'msg.html'))
                    }})
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });}); } });

 app.post("/changepassword", (req, res, next) => {

               if(req.body.oldP==""|| req.body.username==""|| req.body.email==""||req.body.newP==""){
                       return res.status(500).json({
                          message:"Make sure there isn't any empty field"
                         });
                   }
                   else{
                   user.findOneAndUpdate({type:req.body.type,email:req.body.email,name:req.body.username,pass:req.body.oldP},{pass:req.body.newP}).exec()
                       .then(doc=> {if(!doc){
                        return res.status(500).json({
                          message:"The information entered is not correct!",
                       }); 
                       }
                        return res.status(500).json({
                          message:"Password changed successfully!",
                       }); 
                       }).catch(err => {
                             console.log(err);
                             res.status(500).json({
                               error: err
                             });}); } });             
   app.listen(3000)