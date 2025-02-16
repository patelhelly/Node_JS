const http = require('http');
const fs = require('fs');

http.createServer(function(req,res){
    fs.unlink('mytextfile3.txt', function(err){
        if(err) throw err;
        console.log('file deleted');
    })
}).listen(8080);