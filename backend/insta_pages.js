const express = require('express');
const path = require("path");
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"/views"));

app.get("/",(req,res) => {
    res.send("<h1>Home Page</h1>");
});

app.get("/ig/:username", (req,res) => {
    let {username} = req.params;
    const instaData = require('./data.json');
    const data = instaData[username]
    // console.log(data)
    if(data){
        res.render('./instaAccount.ejs',{data});
    }else{
        res.render('./noaccount.ejs')
    }
})