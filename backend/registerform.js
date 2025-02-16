const express = require("express");
const app = express();
const port = 3000;

//handling post request 
app.use(express.urlencoded({extended:true}));
//for json fromat : app.use(express.json());

app.get("/register", (req,res) => {
    let{user,password} = req.query;
    // console.log(user);
    res.send(`GET standard request, ${user}`);
});
app.post("/register", (req,res) => {
    // console.log(req.body);
    let {user,password} = req.body;
    res.send(`POST standard request, ${user}`);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})