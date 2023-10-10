const path = require("path");
const morgan = require("morgan");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "./.env") });
const recipeRouter = require(path.join(__dirname, "./routes/app-route"));

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "./public")));

app.use(expressLayouts);
app.set("layout", "./layouts/main");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use("/", recipeRouter);

mongoose
  .connect(
    process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  )
  .then(() => console.log("Database connected Successfully"))
  .catch(() => console.log("Error connecting to DB"));

const server = app.listen(5000, () =>
  console.log("Server running on PORT: 5000")
);
