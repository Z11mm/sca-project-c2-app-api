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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// Test database
const database = {
  meetings: [
    {
      id: 165,
      event_name: "DevOps Day",
      location: "Abuja",
      no_of_people: 48,
      date_recorded: new Date(),
      user_id: 5
    },
    {
      id: 265,
      event_name: "VueJS meetup",
      location: "Abuja",
      no_of_people: 28,
      date_recorded: new Date(),
      user_id: 3
    },
    {
      id: 564,
      event_name: "Git Meetup",
      location: "Lagos",
      no_of_people: 23,
      date_recorded: new Date(),
      user_id: 3
    },
    {
      id: 111,
      event_name: "REW Meetup",
      location: "Warri",
      no_of_people: 23,
      date_recorded: new Date(),
      user_id: 4
    },
    {
      id: 033,
      event_name: "Percona Meetup",
      location: "Ekiti",
      no_of_people: 50,
      date_recorded: new Date(),
      user_id: 3
    },
  ],
  users: [
    {
      id: 3,
      name: "Ciroma",
      email: "ciroma@ciroma.com",
      department: "Finance",
      joined: new Date(),
      // meeting_id: ''
    },
    {
      id: 4,
      name: "Oma",
      email: "oma@oma.com",
      department: "Sales",
      joined: new Date(),
      // meeting_id: ''
    },
    {
      id: 5,
      name: "Zainab",
      email: "zee@zee.com",
      department: "Sales",
      joined: new Date(),
      // meeting_id: 
    },
  ],
};

// Routes
app.get("/", (req, res) => {
  res.send(dB.users);
});

app.post("/signin", signin.handleSignIn(dB, bcrypt));

app.post("/signup", signup.handleSignUp(dB, bcrypt));

app.get("/profile/:id", profile.getProfile(dB));
app.post("/profile/:id", profile.updateProfile(dB));

app.put("/image", image.setImageEntries(dB));
app.post("/imageurl", image.handleApiCall());

// Test dB requests
app.get("/meeting", (req, res) => {
  res.json(database.meetings);
});

// const newMeeting = database.meetings[database.meetings.length - 1]
// const updateUsersTable = (meeting, userstable, id) => {
//   for (let i = 0; i < userstable.length; i++) {
//     if (userstable[i].id === id) {
//       userstable[i].meeting_id = newMeeting.id;
//       console.log(userstable[i]);
//       // console.log(newMeeting.id)
//     }
//   }
// }

// Add meeting by user id
app.post("/profile/:id/meeting", (req, res) => {
  const { id } = req.body;
  const { event_name, no_of_people, location } = req.body.formInput;
  const { meetings, users } = database;
  let found = false;

  // Validation checks
  if (!event_name || !location || !no_of_people) {
    return res.json("incomplete form fields");
  }
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      meetings.push({
        id: "411",
        event_name: event_name,
        location: location,
        no_of_people: no_of_people,
        date_recorded: new Date(),
        user_id: id
      });
      return res.json(meetings[meetings.length - 1]);
    }
  })
  res.json('not found');
});

// Get meetings by user id
app.get("/profile/:id/meeting", (req, res) => {
  const { id } = req.body;
  const { meetings, users } = database;
  let found = false;

  // Validation checks
  if (!event_name || !location || !no_of_people) {
    return res.json("incomplete form fields");
  }
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      meetings.push({
        id: "411",
        event_name: event_name,
        location: location,
        no_of_people: no_of_people,
        date_recorded: new Date(),
        user_id: id,
      });
      return res.json(meetings[meetings.length - 1]);
    }
  });
  res.json("not found");
});

app.get('/meeting/:id', (req, res) => {
  const { id } = req.params;
  // const { event_name, no_of_people } = req.params;
  let found = false;
  database.meetings.forEach(meeting => {
    if (meeting.id === id) {
      found = true;
      return res.json(meeting);
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})


app.listen(3000, () => {
  console.log("app is running");
});
