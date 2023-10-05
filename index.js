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
    host: process.env.POSTGRES_HOST,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
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

app.listen(3001, () => {
  console.log(`listening on ${3001}`);
});
