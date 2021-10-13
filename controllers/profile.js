const getProfile = (dB) => (req, res) => {
  const { id } = req.params;

  dB.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("Error getting user"));
};

const updateProfile = (dB) => (req, res) => {
  const { id } = req.params;
  const { name, department, title } = req.body.formInput;

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
