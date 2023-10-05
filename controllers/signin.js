export const singinHandler = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect Values");
  }

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
};
