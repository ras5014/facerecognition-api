import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "varmis5saske5",
    database: "postgres",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
  const response = await db.select("*").from("users");
  res.json(response);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await db
      .select("email", "hash")
      .from("login")
      .where("email", "=", email);

    // Checking is password is same
    const hashedPassword = response[0].hash;
    const isValid = bcrypt.compareSync(password, hashedPassword);

    if (isValid) {
      const user = await db
        .select("*")
        .from("users")
        .where("email", "=", email);
      console.log(user[0]);
      res.status(200).json(user[0]);
    } else {
      res.status(404).json("User not found Or Invalid login");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  try {
    // Inserting to Register DB

    const response = await db("users").insert({
      name: name,
      email: email,
      joined: new Date(),
    });

    // Inserting to login DB

    const response2 = await db("login").insert({
      email: email,
      hash: hash,
    });
    res.status(200).json("Successfully Registered and Created login entry");
  } catch (e) {
    res.status(404).json({ error: "Can't Register Or Create a Login Entry" });
  }
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);
  try {
    const user = await db.select("*").from("users").where({
      id: userId,
    });
    if (user.length > 0) {
      // An empty array in javascript is still true so check with length
      // Here we user is an "Array of Objects"
      res.status(200).json(user[0]);
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/image", async (req, res) => {
  const { id } = req.body;
  const userId = Number(id);
  try {
    const response = await db("users")
      .where("id", "=", userId)
      .increment("entries", 1)
      .returning("entries");
    res.status(200).json(response[0]);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
});

app.listen(3001, () => {
  console.log("listening on 3001");
});
