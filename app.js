const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || 3000
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const dB = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        // connectionString: process.env.DATABASE_URL,
        // ssl: true,
    },
})

dB.select('*').from('users')

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send(dB.users)
})

app.post('/signin', signin.handleSignIn(dB, bcrypt))

app.post('/signup', signup.handleSignUp(dB, bcrypt))

app.get('/profile/:id', profile.getProfile(dB))

app.put('/image', image.setImageEntries(dB))
app.post('/imageurl', image.handleApiCall())

app.listen(3000, () => {
    console.log('app is running');
})
