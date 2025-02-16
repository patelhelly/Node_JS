const express = require('express');
const app = express();
const ExpressError = require('./ExpressError')

// app.use((req,res,next) => {
//     console.log(("this is first middleware"));
//     next();
//     // console.log("this is after next");
// });
// app.use((req,res,next) => {
//     console.log(("this is second middleware"));
//     next();
// });

//utility middleware
app.use((req,res,next) => {
    req.time = new Date(Date.now());
    console.log(req.method, req.hostname, req.pathname, req.time);
    next();
});

//app.use(path,callback)
app.use("/random", (req,res,next) =>{
    console.log("i am only for random");
    next();
});

//api token as query string
const checkToken = (req,res,next) => {
    let {token} = req.query;
    if(token === "giveaccess"){
        next();
    }
    throw new ExpressError(401,"Access denied");
}

app.get("/api", checkToken, (req,res) =>{
    res.send("data");
});

app.get("/", (req,res) =>{
    res.send("this is root");
});

app.get("/random", (req,res) =>{
    res.send("this is random page");
})

app.get("/err",(req,res)=>{
    abcd = abcd;
});

app.get("/admin", (req,res) =>{
    throw new ExpressError(403,"Access to admin is frobidden");
})

app.use((err,req,res,next) => {
    // console.log("error handling 1");
    let{status=500,message} = err;
    res.status(status).send(message);
    // next(err);                  //we want to call error handling midlewares
});

// app.use((err,req,res,next) => {
//     console.log("called by next(err)");
//     next(err);
// });

//404
app.use((req,res) => {
    res.send("Page not found");
});

app.listen(3000, () =>{
    console.log("server listening");
});