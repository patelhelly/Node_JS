import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import connectDB from "./config/database.js";
import userRouter from "./routes/user.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import ExpressError from "./utils/ExpressError.js";

dotenv.config();

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

const Port = process.env.PORT || 8080;

app.use("/api/user", userRouter);

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use(ErrorHandler);

app.use((err, req, res, next) => {
  const error = new Error("Something Went Wrong!");
  error.statusCode = 500;
  next(error);
});

app.listen(Port, () => {
  console.log(`Server Listening from ${Port}`);
});
