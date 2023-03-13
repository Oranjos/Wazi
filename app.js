
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wazDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const Waz = new mongoose.model("Waz", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new Waz({
        email : req.body.username,
         password : req.body.password
    });

    newUser.save();
    res.render("secrets");
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    Waz.findOne({email: username})
         .then((foundUser) =>{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
         })
         .catch((error) => {
            console.log(err);
            res.send(400, "Bad Request");
         });
    // User.findOne({email: username}, function(req, res){
        // if(err){
            // console.log(err)
        // }else{
            // if(foundUser){
                // if(foundUser.password === password){
                //    res.render("secrets")
                // }
            // }
        // }
    // });
});


app.listen("3000", function(){
    console.log("Server started on port 3000")
});