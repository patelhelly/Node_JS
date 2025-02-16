const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/test');
main().then(() => {
    console.log("Connection established")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:String,
    age:{
        type:Number,
        min:[18,"Minimun age must be 18"]
    }
});

const User = mongoose.model("User",userSchema);

//add data//
//User-1//
// const user1 = new User({
//     name:"adam",
//     email:"adam@12gmail.com",
//     age:17
// });
// user1
// .save();

//User-1//
// const user2 = new User({
//     name:"eve",
//     email:"eve@12gmail.com",
//     age:24
// });

// user2
// .save()
// .then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

//to insert multiple data
// User.insertMany([
//     {name:"peter",email:"peter@gmail.com",age:30},
//     {name:"robert",email:"robert@gmail.com",age:50},
//     {name:"jil",email:"jil@gmail.com",age:23}
// ]);

//find//
// User.find({age:{$gte:30}}).then((res) => {console.log(res)});
// User.findOne({age:{$gte:30}}).then((res) => {console.log(res)});
// User.findById('66508728b160c40e27975fa0').then((res) => {console.log(res)});

//update data//
// User.updateOne({name:'jil'},{age:22}).then((res) => {console.log(res)});
// User.updateMany({age:22},{age:23}).then((res) => {console.log(res)});

//find and update//
// User.findOneAndUpdate({name:"adam"},{email:"adam12@gmail.com"},{new:true}).then((res) =>{console.log(res)});
// User.findByIdAndUpdate({_id:"66508728b160c40e27975f9e"},{email:"peterparker@gmail.com"},{new:true}).then((res) =>{console.log(res)});

//delete//
// User.deleteOne({name:"adam"}).then((res) => {console.log(res)});
User.deleteMany({age:{$gte : 30}}).then((res) => {console.log(res)});