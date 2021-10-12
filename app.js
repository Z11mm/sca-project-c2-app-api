require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const signup = require("./controllers/signup");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const meeting = require("./controllers/meeting");

const PORT = process.env.PORT || 3000;

const dB = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("combined"));

// Routes
app.get("/", async (req, res) => {
  try {
    const users = await dB("users");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Error getting users" });
  }
});

app.post("/signin", signin.handleSignIn(dB, bcrypt));

app.post("/signup", signup.handleSignUp(dB, bcrypt));

app.get("/profile/:id", profile.getProfile(dB));
app.post("/profile/:id", profile.updateProfile(dB));

app.put("/image", image.setImageEntries(dB));
app.post("/imageurl", image.handleApiCall());

app.get("/meeting", meeting.getAllMeetings(dB));

// Add meeting by user id
app.post("/profile/:id/meeting", (req, res) => {
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
app.get("/profile/:id/meeting", async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const userMeetings = await dB("meetings").where({ user_id: id });
    // console.log(userMeetings)
    return res.status(200).json(userMeetings);
  } catch (err) {
    return res.status(404).json({ message: "Error getting meetings" });
  }
});

// app.get("/meeting/:id", (req, res) => {
//   const { id } = req.params;
//   // const { event_name, no_of_people } = req.params;
//   let found = false;
//   database.meetings.forEach((meeting) => {
//     if (meeting.id === id) {
//       found = true;
//       return res.json(meeting);
//     }
//   });
//   if (!found) {
//     res.status(400).json("not found");
//   }
// });

app.listen(3000, () => {
  console.log("app is running");
});
