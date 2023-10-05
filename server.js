import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

// In ES6 we have to write .js when importing
import * as register from "./controllers/register.js";
import * as signin from "./controllers/signin.js";
import * as image from "./controllers/image.js";
import * as profile from "./controllers/profile.js";
import dotenv from "dotenv";
dotenv.config();

// Database configuration
const db = knex({
  client: "pg",
  connection: {
    host: process.env.HOST,
    port: process.env.PORT2,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
  const response = await db.select("*").from("users");
  res.json(response);
});

app.post("/signin", (req, res) => {
  // This db and bcrypt argument passing is known as dependency injection
  signin.singinHandler(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.registerHandler(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.profileHandler(req, res, db);
});

app.put("/image", (req, res) => {
  image.imageHandler(req, res, db);
});

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT1}`);
});
