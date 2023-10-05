export const registerHandler = async (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  // Adding Security Validation
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect Fom Submission Values");
  }

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
};
