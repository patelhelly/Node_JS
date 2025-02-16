const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const{v4:uuidv4} = require('uuid');
const methodOverride = require('method-override');

let posts = [
    {
        id:uuidv4(),
        username: "helly",
        content: "Learning Nodejs"
    },
    {
        id:uuidv4(),
        username: "jenny",
        content: "Working on MERN Stack project"
    },
    {
        id:uuidv4(),
        username: "rahul",
        content: "Working on AI research work"
    },
]

app.use(express.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));

app.get("/posts",function(req,res){
    res.render('index.ejs',{posts});
});

app.get("/posts/new",function(req,res){
    res.render('new.ejs');
});

app.post("/posts",function(req,res){
    // console.log(req.body);
    let{username , content} = req.body;
    let id = uuidv4();
    posts.push({id,username,content});
    // res.send('post request working');
    res.redirect('/posts');
});

app.get("/posts/:id/edit",function(req,res){;
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs",{post});
});
app.patch("/posts/:id/edit",function(req,res){
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});

app.delete("/posts/:id",function(req,res){
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
    // console.log(posts)
});

app.get("/posts/:id",function(req,res){
    let {id} = req.params;
    // console.log(id);
    let post = posts.find((p) => id === p.id);
    // console.log(post)
    res.render("show.ejs",{post});
});

app.listen(port,() => {
    console.log(`listening to port ${port}`);
});