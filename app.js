const express = require('express');
const bodyParser = require('body-parser');
const pdfP =require('pdf2json');
const app  =express();
const crypto= require('crypto');
const multer=require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose =require('mongoose')
const fs =require('fs')
const getStream =require('get-stream')
const mysql = require('mysql2');
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(bodyParser.raw())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("./files"))
const path =require('path');
//const db= require("./db");
//const fs= require('fs');
const pdfParse= require("pdf-parse");
const user =require("./models/user");
const uri= 'mongodb+srv://user:dbUser@cluster0.um1b0.mongodb.net/lib?retryWrites=true&w=majority'
const pdfjs=require("pdfjs-dist/legacy/build/pdf")

async function getContent(src){
  const doc = await pdfjs.getDocument(src).promise
  const page = await doc.getPage(2)
  return await page.getTextContent()
}

async function getItems(src){
  const content = await getContent(src)
  const items=content.items
  /*
for(let i=0;i<items.length;i++){
if(items[i].width>10){
  console.log(i)
      console.log(items[i].str)
}}
    */
let a=items[29].str
 return a;
}

  var connection = mysql.createConnection({
    connectionLimit:10,
    host: 'localhost',
    user: 'root',
    password: '3005',
    database: 'lib'
  });
  connection.connect(function(error){
    if(error){
      console.log("err")
    }
else{
  console.log('connected')
}  })


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'models/files');
  },
  filename: function (req, file, cb) {
    var id = file.originalname ;
    cb(null, id);
  }
});
var upload = multer({ storage: storage })



    app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'index.html'));
    });


    app.get('/register',(req,res)=>{
        res.sendFile(path.join(__dirname,'pass.html'));
    });
    app.get('/user',(req,res)=>{
      res.sendFile(path.join(__dirname,'user.html'));
  });
  app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'admin.html'));
});

   app.post("/user",upload.single('file'),async (req, res, next) => { 
   const file=req.file
  const a = await getItems(file.destination+"/"+file.filename)
console.log(a)

    var sql = "INSERT INTO `files`( `name`,`proje_adı`) VALUES (?,?)";
   connection.query(sql,[req.file.originalname,a], function(err, result) {
     if(err){
       console.log("error")
     }
     })
res.redirect('/user')
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
  else{ connection.query('SELECT * FROM `user`' , (err, rows) => {
        if (err) {
      console.log("Error")
      
        }
        else{
          console.log("success")
          for(let i=0;i<rows.length;i++){
            if(rows[i].username==req.body.name && rows[i].password==req.body.password && rows[i].type==req.body.type){
            if (req.body.type=='admin'  ) {
              res.redirect('/admin')}
              else if (req.body.type=='user'  ) {
                         
              res.redirect('/user')
            
            }}
            else {
                
                 res.sendFile(path.join(__dirname,'msg.html'))
                   }} }
                      
                    }) }    })
                    
 app.post("/changepassword", (req, res) => {

               if(req.body.oldP==""|| req.body.username==""|| req.body.email==""||req.body.newP==""){
                       return res.status(500).json({
                          message:"Make sure there isn't any empty field"
                         });
                   }
                   else{
                  connection.query('SELECT * FROM `user`' , (err, rows) => {
                    
                        for(let i=0;i<rows.length;i++){
                          if(rows[i].username==req.body.username && rows[i].email==req.body.email && rows[i].password==req.body.oldP && rows[i].type==req.body.type){
                        
                   const query='UPDATE `user` SET  `password`=? where `username`=?'
                   connection.query(query,[req.body.newP,rows[i].username], (err, rows) => {
                          if(err){
                            console.log("error")}
                            else{
                              console.log("success")
                           } })
                                return res.status(500).json({
                                  message:"Password changed successfully!",})} 
                            else{
                                  return res.json({
                                    message:"Information entered is not correct!",}) 
                                 }
                      
                      }})}})
    
  app.get('/files',(req,res,next)=>{
                          let a                     
                         connection.query('SELECT * FROM `files`' , (err, rows) => {
                             if (err) {
                           console.log("Error")
                           
                             }
                             else{
                               console.log("success")
                                 a= JSON.stringify(rows)
                       
                           }const  t=JSON.parse(a) 
                            
                           res.json(t) 
                         }) 
                                         
                                               })                                  
   app.listen(3000)