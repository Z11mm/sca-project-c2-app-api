// from dotenv config file
const { db } = require("./config");

// dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");


const signup = require("./controllers/signup");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const meeting = require("./controllers/meeting");


const dB = knex({
  client: "pg",
  // connection: {
  //   host: db.host,
  //   user: db.user,
  //   password: db.password,
  //   database: db.name
  // },
  connection: db.uri
});


// Routes
router.get("/api", async (req, res) => {
  res.send('Hello there')
});

router.post("/signin", signin.handleSignIn(dB, bcrypt));

router.post("/signup", signup.handleSignUp(dB, bcrypt));

router.get("/profile/:id", profile.getProfile(dB));
router.put("/profile/:id", profile.updateProfile(dB));

router.put("/image", image.setImageEntries(dB));
router.post("/imageurl", image.handleApiCall());

router.get("/meeting", meeting.getAllMeetings(dB));

// Add meeting by user id
router.post("/profile/:id/meeting", (req, res) => {
  const { id } = req.params;
  const { event_name, no_of_people, location } = req.body.formInput;

  if (!event_name || !location || !no_of_people) {
    return res.json("incomplete form fields");
  }

  dB.insert({
    event_name: event_name,
    no_of_people: no_of_people,
    location: location,
    user_id: id,
  })
    .into("meetings")
    .returning("*")
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(400).json({ message: "Error adding meeting" });
    });
});

// Get meetings by user id
router.get("/profile/:id/meeting", async (req, res) => {
  const { id } = req.params;
  try {
    const userMeetings = await dB("meetings").where({ user_id: id });
    return res.status(200).json(userMeetings);
  } catch (err) {
    return res.status(404).json({ message: "Error getting meeting" });
  }
});

// Delete meeting by id
router.delete("/meeting/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const targetMeeting = await dB("meetings")
      .where({ id: id })
      .returning("*")
      .del();
    return res.status(200).json(targetMeeting);
  } catch (err) {
    return res.status(404).json({ message: "Error deleting meeting" });
  }
});

router.get("/meeting/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const targetMeeting = await dB("meetings").where({ id: id }).returning("*");
    return res.status(200).json(targetMeeting);
  } catch (err) {
    return res.status(404).json({ message: "Meeting not found" });
  }
});

module.exports = router;

