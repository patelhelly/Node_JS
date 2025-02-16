const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "helly@123",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//home page
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log(`Result:`,result);
      let user_count = result[0]["count(*)"].toString();
      res.render("home.ejs", { user_count });
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

//new user form
app.get("/user/new", (req, res) => {
  res.render("newuser.ejs");
});

//adding new user
app.post("/users", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  let user = [id, username, email, password];
  let q = `INSERT INTO user (id,username,email,password) VALUES  (?,?,?,?)`;
  try {
    connection.query(q, user, (err, result) => {
      if (err) throw err;
      // console.log(`Result:`,result);
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
});

//displaying user details
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log(`Result:`,result);
      let userData = result;
      res.render("showusers.ejs", { userData });
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

//user detail edit form
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log(`Result:`,result);
      let userData = result[0];
      res.render("edit.ejs", { userData });
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

//updating user detail
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    console.log(id);
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(`Result:`, result[0]);
      let userData = result[0];
      if (formPass != userData.password) {
        res.send("WRONG PASSWORD");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

//user detail delete form
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log(`Result:`,result);
      let userData = result[0];
      res.render("delete.ejs", { userData });
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

//deleting user
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let {
    password: formPass,
    email: formemail,
    username: newUsername,
  } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    console.log(id);
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(`Result:`, result[0]);
      let userData = result[0];
      if (formPass != userData.password) {
        res.send("WRONG PASSWORD");
      } else if (formemail != userData.email) {
        res.send("WRONG EMAIL");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send("Error in database");
  }
});

app.listen(port, () => {
  console.log(`server listening from `, port);
});

//100 fake data :
// let q = "INSERT INTO user (id,username,email,password) VALUES  ?";
// // let user = ["123","test","test@123gmail.com","test@123"];
// let data = [];
// for(let i=1 ; i<=100 ; i++){
//     data.push((getRandomUser()));       //100 fake user
// }

// try{
// connection.query(q, [data], (err,result) => {
//     if(err) throw err;
//     console.log(`Result:`,result);
// })}
// catch(error){
//     console.log(error);
// }

// connection.end();
