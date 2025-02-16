const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main().then(() => {
    console.log("Connection established");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/chat_app');
} 

const allchats = [
    {
        from:'adam',
        to:'eve',
        msg:'Send me project updates',
        created_at: new Date(),
    },
    {
        from:'jil',
        to:'jenny',
        msg:'Whats up!',
        created_at: new Date(),
    },
    {
        from:'robert',
        to:'peter',
        msg:`Send me today's meeting presentation`,
        created_at: new Date(),
    },
    {
        from:'eve',
        to:'peter',
        msg:'Can you complete the updates by the end of te day',
        created_at: new Date(),
    },
    {
        from:'diva',
        to:'riva',
        msg:'Can I borrow your dress today?',
        created_at: new Date(),
    },
    {
        from:'shub',
        to:'sara',
        msg:'Hello, whats up!',
        created_at: new Date(),
    },
]
Chat.insertMany(allchats);
