const getProfile = (dB) => (req, res) => {
  const { id } = req.params;

  dB.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      res.status(200).json(user[0]);
    })
    .catch((err) => res.status(400).json("Error getting user"));
};

const updateProfile = (dB) => (req, res) => {
  const { id } = req.params;
  const { name, department, title } = req.body.formInput;

  if (!name || !department || !title) {
    return res.status(400).json("incorrect form submission");
  }

  // Search users table by id and return user
  dB("users")
    .where({ id })
    .update({ name, department, title })
    .returning("*")
    .then((data) => {
      if (data) {
        res.json({ message: "Profile updated", data });
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch((err) => res.status(400).json("error updating user"));
};

module.exports = {
  getProfile: getProfile,
  updateProfile: updateProfile,
};
