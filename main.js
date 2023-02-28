const express = require('express')
const app = express()
const fs=require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const port = 3000
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    
  }))
 
 // app.use(express.static("public"))
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
app.route('/').get( (req, res) => {
//   console.log(req.session)
//   console.log(req.body);
  if( req.session.isLoggedIn==undefined ){
   // console.log("chal ja na");
    res.sendFile(__dirname+"/public/home/index.html");
  }
  
  else if(req.session.isLoggedIn==false){
    res.sendFile(__dirname+"/public/home/index.html");
  }
  else {
    res.redirect('/result');
  }
  
 
})
.post((req,res)=> {

    res.sendFile(__dirname+"/public/home/index.html");
})

//creating route for the signup page
app.route("/signup").get((req,res)=>{
    if( req.session.isLoggedIn==undefined ){
        console.log("chal ja na");
        res.sendFile(__dirname+"/public/signup/index.html");
      }
      
      else if(req.session.isLoggedIn==false){
        console.log("false chla")
        res.sendFile(__dirname+"/public/signup/index.html");
      }
      else {
        console.log("true chala")
        res.redirect('/result');
      }
})
.post((req,res)=>{
    if( req.session.isLoggedIn==undefined ){
     //   console.log("chal ja na");
        res.sendFile(__dirname+"/public/signup/index.html");
      }
      
      else if(req.session.isLoggedIn==false){
        res.sendFile(__dirname+"/public/signup/index.html");
      }
      else {
        res.redirect('/result');
      }
})

app.route("/login").get((req,res)=>{
    if( req.session.isLoggedIn==undefined ){
      //  console.log("chal ja na");
        res.sendFile(__dirname+"/public/login/index.html");
      }
      
      else if(req.session.isLoggedIn==false){
        res.sendFile(__dirname+"/public/login/index.html");
      }
      else {
        res.redirect('/result');
      }
})
.post((req,res)=>{
    if( req.session.isLoggedIn==undefined ){
       // console.log("chal ja na");
        res.sendFile(__dirname+"/public/login/index.html");
      }
      
      else if(req.session.isLoggedIn==false){
        res.sendFile(__dirname+"/public/login/index.html");
      }
      else {
        res.redirect('/result');
      }
})
app.post('/storeResult',(req,res)=>{
    fs.readFile(__dirname+"/db.txt","utf-8",(err,data)=>{
        let obj;
        if(err){
            res.end("Fail to open the database")
        }
        else {
                if(data.length===0){
                    obj=[];
                }
                else {
                    obj=JSON.parse(data);
                   
                }
                let newObj=obj.filter(function(value){
                    if(value.email==req.body.email){
                        return true;
                    }
                    else {
                        return false;
                    }
                })
                if(newObj.length==0){
                    req.session.email=req.body.email;
                    obj.push({'email':req.body.email,'password':req.body.password});
                    fs.writeFile(__dirname+"/db.txt",JSON.stringify(obj),(err)=>{
                        if(err){
                           
                            res.end("Fail to save data in the database");
                        }
                        else {
                         //   console.log("inside else");
                            req.session.isLoggedIn=true; 
                           // console.log(req.session);
                            res.redirect('/result');
                        }
                    })
                }
                else {
                    req.session.isLoggedIn=false;
                    res.redirect('/signup')
                }
                
              
        }
    })
})
app.get("/result",(req,res)=>{
    console.log(req.session);
    console.log("hello");
    console.log("I am working in the result page");
       
        
       
    res.sendFile(__dirname+"/public/result/index.html");
})
app.post("/check",(req,res)=>{
            // console.log(req.body);
            // console.log("In the check function")
            fs.readFile('./db.txt',"utf-8",(err,data)=>{
                let obj;
                let flag=false;
                if(err){
                    res.end("Fail to open the database inside login");
                }
                else {
                    if(data.length===0){
                        res.end("Error occured");
                    }
                    else {
                        obj=JSON.parse(data);
                        // console.log("tu chala h kya");
                        // console.log(obj);
                        obj.forEach(function(value){
                            if(value.email===req.body.email &&value.password===req.body.password){
                                flag=true;
                                req.session.email=value.email;
                               // console.log(req.session);
                            }
                        })
                        if(flag){
                            // console.log("ye bhi chal rha h kya?")
                            req.session.isLoggedIn=true;
                            res.redirect('/result');
                        }
                        else {
                            req.session.isLoggedIn=false;
                            res.redirect("/login");
                        }
                        // console.log(req.session);
                       // res.end("aage krte h abhi")
                    }
                }
            })
            // res.end("hello world")
})
app.post('/logout',(req,res)=>{
   req.session.destroy();
   res.redirect('/');
})
app.post('/getdata',(req,res)=>{
    if(req.session.isLoggedIn==undefined){
        res.end("-1");
    }
    else {
        res.end(JSON.stringify(req.session.isLoggedIn));
    }
   
})
app.post('/getuser',(req,res)=>{
    res.end(JSON.stringify(req.session.email));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})