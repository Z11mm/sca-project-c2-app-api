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

app.get('/meeting', meeting.getMeetings(dB));

app.listen(3000, () => {
  console.log("app is running");
});
