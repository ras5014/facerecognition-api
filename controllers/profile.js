export const profileHanlder = async (req, res, db) => {
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
};
