//Serving static files

//app.use(express.static(file_name))
//express.static -> middleware
//include css,js file that come alnog with response

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"/views"));

//app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("public/css"));

app.get("/", (req,res) => {
    res.render('home.ejs');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});