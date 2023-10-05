export const imageHandler = async (req, res, db) => {
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
};
