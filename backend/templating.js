//EJS : Embedded Javascript templates
//EJS is a simple templating lang. that let you generate HTML markup with plain js

const express = require("express");
const path = require("path");
const app = express();

const port = 3000;

app.set("view engine","ejs");
//in presence of ejs we don't send res we render res
//store the templates in view folder

//views directory : 
app.set("views" , path.join(__dirname,"/views"));

app.get("/",(req,res) =>{
    res.render("home.ejs");
});
app.get("/ig/:username",(req,res) =>{
    let {username} = req.params;
    const followers = ['adam' , 'rahul' , 'jenny' , 'riya']
    res.render("instagram.ejs",{username,followers});
});
app.get("/rolldice",(req,res) =>{
    let diceValue = Math.floor(Math.random() * 6 + 1);
    res.render("rolldice.ejs",{diceValue});
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});