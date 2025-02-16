//node js has build-in module called http
const http = require('http');
const url = require('url');
//The HTTP module can create an HTTP server that listens to server ports and gives a 
//response back to the client.
http.createServer(function(req,res){
    //If the response from the HTTP server is supposed to be displayed as HTML, 
    //you should include an HTTP header with the correct content type
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');

    //read the query string
    // res.write(req.url); 

    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;

    res.end(txt);
}).listen(8080);