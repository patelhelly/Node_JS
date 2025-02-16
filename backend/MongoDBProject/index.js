const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat.js');
const methodOverride = require('method-override');

app.set("views" , path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

main().then(() => {
    console.log("Connection established");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/chat_app');
} 

app.get("/", (req,res) => {
    res.render("home.ejs");
});

app.get("/chats", async(req,res) => {
    let chats = await Chat.find();
    res.render("chats.ejs",{chats});
});

app.get("/chats/new", (req,res) => {
    res.render("newchat.ejs")
});

app.post("/chats", (req,res) => {
    let{from,msg,to} = req.body;
    let newChat = new Chat ({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date(),
    });
    newChat
    .save()
    .then((res) => {
        console.log("chat was saved");
    })
    .catch((err) => {
        console.log(err);
    });
    res.redirect("/chats");
});


app.get("/chats/:id/edit", async(req,res) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    console.log(chat)
    res.render("edit.ejs",{chat});
});

app.put("/chats/:id", async(req,res) => {
    let {id} = req.params;
    let{msg:newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        {msg : newMsg},
        {runValidators:true , new:true}
    );
    console.log(updatedChat);
    res.redirect("/chats");
});

app.delete("/chats/:id", async(req,res) =>{
    let {id} = req.params;
    let deleteChat = await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats");
})

app.listen(3000, () =>{
    console.log("server listening");
});
