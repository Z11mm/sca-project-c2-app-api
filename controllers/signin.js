// const jwt = require("jsonwebtoken");
// const redis = require("redis");
// const JWT_SECRET = process.env.JWT

// setup Redis for session mgmt
// const redisClient = redis.createClient(process.env.REDIS_URI);


const handleSignIn = (dB, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  dB.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return dB
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));
};

// Get userID from JWT token
// const getAuthTokenId = (req, res) => {
//   const { authorization } = req.headers;

//   redisClient.get(authorization, (err, reply) => {
//     if (err || !reply) {
//       return res.status(400).json('Unauthorized');
//     } else {
//       return res.json({id: reply})
//     }
//   })

// };

// const signToken = (email) => {
//   const jwtPayload = { email };
//   return jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "2 days" });
// };

// Add user id to token in
// const setToken = (tokenkey, uservalue) => {
//   return Promise.resolve(redisClient.set(tokenkey, uservalue));
// };

// const createSessions = async (user) => {
  // create JWT, return with some user data
//   const { id, email } = user;
//   const token = signToken(email);
//   try {
//     await setToken(token, id);
//     return { success: "true", userId: id, token };
//   } catch (message) {
//     return console.log(message);
//   }
// };

// Keep user signed in if JWT exists else...
// const signInAuthentication = (dB, bcrypt) => (req, res) => {
//   const { authorization } = req.headers;

//   return authorization
//     ? getAuthTokenId(req,res)
//     : handleSignIn(dB, bcrypt, req, res)
//         // create sessions with user details
//         .then((data) => {
//           return data.id && data.email
//             ? createSessions(data)
//             : Promise.reject(data);
//         })
//         .then((session) => res.json(session))
//         .catch((err) => res.status(400).json(err));
// };

// module.exports = {
//   signInAuthentication: signInAuthentication,
//   redisClient: redisClient
// };



module.exports = {
  handleSignIn: handleSignIn
}
