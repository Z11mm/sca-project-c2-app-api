const handleSignUp = (dB, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json('incorrect form submission');
  }

  // Insert encrypted password into login table, add user to users table and login the user.
  const hash = bcrypt.hashSync(password);
  dB.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name:name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.status(200).json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('unable to sign up'));
};

module.exports = {
  handleSignUp: handleSignUp
};
