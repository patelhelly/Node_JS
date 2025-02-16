// Disable SSL verification (for development purposes only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const wrapAsync = require("./utils/wrapAsync.js");
const userRouter = require("./routes/user.js");
const userListRouter = require("./routes/userList.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not verified" });
      } else {
        req.id = decoded.id;
        req.username = decoded.username;
        req.email = decoded.email;
        req.file = decoded.file;
        next();
      }
    });
  }
};

app.get(
  "/",
  verifyUser,
  wrapAsync(async (req, res) => {
    return res.json({
      status: "Success",
      id: req.id,
      username: req.username,
      email: req.email,
      file: req.file,
    });
  })
);

app.use("/", userRouter);
app.use("/user", userListRouter);

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
