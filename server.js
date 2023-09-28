import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: 123,
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  try {
    if (
      req.body.email === database.users[0].email &&
      req.body.password === databse.users[0].password
    ) {
      res.status(200).json("Signed in successfully");
    } else {
      res.status(404).json("Signed in failed");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  try {
    database.users.push({
      id: 125,
      name: "Ann",
      email: "ann@gmail.com",
      password: "apples",
      entries: 0,
      joined: new Date(),
    });
    res.status(200).json("Successfully registered");
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);
  try {
    const user = database.users.find((user) => user.id === userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const userId = Number(id);
  try {
    const user = database.users.find((user) => user.id === userId);
    if (user) {
      user.entries++;
      res.status(200).json(user.entries);
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
