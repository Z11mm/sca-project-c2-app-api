const jwt = require("jsonwebtoken");
const redis = require("redis");

// setup Redis for session mgmt
const redisClient = redis.createClient(process.env.REDIS_URI);

// Check database and return user Promise
const handleSignIn = (dB, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return dB
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return dB
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((err) => Promise.reject("unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch((err) => Promise.reject("wrong credentials"));
};

const getAuthTokenId = () => {
  console.log("auth ok");
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT, { expiresIn: "6 hours" });
};

const createSessions = (user) => {
  // create JWT, return user data
  const { id, email } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token };
};

// Keep user signed in if JWT exists else...
const signInAuthentication = (dB, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? getAuthTokenId()
    : handleSignIn(dB, bcrypt, req, res)
        // create sessions with user details
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  signInAuthentication: signInAuthentication
};
