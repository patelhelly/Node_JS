const express = require("express");
const app = express();

// console.dir(app);

let port = 3000;

app.listen(port,() => {
    console.log(`app is listening on port ${port}`);
});

app.use((req,res) => {
    // console.log(req);
    console.log('request received');
    res.send('It will listen request and send response.');
    // res.send({
    //     name: "Helly",
    //     technology: "Node.js"
    // });
    // let code = "<h1>Helly Patel</h1>"
    // res.send(code);
})


