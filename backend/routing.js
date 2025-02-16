const express = require("express");
const app = express();

// console.dir(app);

let port = 3000;

app.listen(port,() => {
    console.log(`app is listening on port ${port}`);
});

//Routing: it is process of selecting path in a network or between or across multiple network

app.get("/",(req,res) =>{
    res.send('it routed to root page for get request');
});
app.get("/home",(req,res) =>{
    res.send('it routed to home page');
});
app.get("/contactus",(req,res) =>{
    res.send('it routed to contact us page');
});
//Path parameter:
app.get("/:username/:id",(req,res) =>{
    // console.log(req.params);
    let{username,id} = req.params;
    res.send(`welcome,${username}@${id}`);
});
app.get("/search",(req,res) =>{
    // console.log(req.query);
    let {q} = req.query;
    if(!q){
        res.send('Nothing Search');
    }
    res.send(`<h1>showing result for ${q}</h1>`);
});
app.get("*",(req,res) =>{
    res.send(`this path doesn't exists`);
});
// app.post("/",(req,res) =>{
//     res.send('it send post request to root page');
// });

//Nodemon: automatically restart server with code changes

