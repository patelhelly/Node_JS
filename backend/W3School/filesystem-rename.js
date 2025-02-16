const http = require('http');
const fs = require('fs');

http.createServer(function(req,res){
    fs.rename('mytextfile4.txt' , 'myrenamedtextfile.txt' , function(err){
        if(err) throw err;
        console.log('file renamed');
    })
}).listen(8080);