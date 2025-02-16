const http = require('http');
const fs = require('fs');

// http.createServer(function(req,res){
//     fs.appendFile('mytextfile.txt',' file updated',function(err){
//         if(err) throw err;
//         console.log('updated')
//     })
// }).listen(8080);


//The fs.writeFile() method replaces the specified file and content:
// http.createServer(function(req,res){
//     fs.writeFile('mytextfile2.txt',' file updated',function(err){
//         if(err) throw err;
//         console.log('updated')
//     })
// }).listen(8080);