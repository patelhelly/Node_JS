const http = require('http');
const fs = require('fs');

//The fs.appendFile() method appends specified content to a file. 
//If the file does not exist, the file will be created:

// http.createServer(function(req,res){
//     fs.appendFile('mytextfile.txt','created new file' , function(err){
//         if(err) throw err;
//         console.log('saved');
//     });
// }).listen(8080);

//The fs.open() method takes a "flag" as the second argument, if the flag is "w" for "writing", the specified file is opened for writing.
// If the file does not exist, an empty file is created :

// http.createServer(function(req,res){
//     fs.appendFile('mytextfile1.txt','w' , function(err){
//         if(err) throw err;
//         console.log('Saved');
//     });
// }).listen(8080);

//The fs.writeFile() method replaces the specified file and content if it exists. 
//If the file does not exist, a new file, containing the specified content, will be created:

http.createServer(function(req,res){
    fs.writeFile('mytextfile2.txt','New file created' , function(err){
        if(err) throw err;
        console.log('Saved');
    });
}).listen(8080);