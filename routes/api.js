/* Packages I used */
import express from 'express';
import bcrypt from 'bcrypt';

/* MongoDB Models */
import User from '../models/user/index';

const router = express.Router(); // call express.Router function to provide route

router.get('/', (req, res) => {
  res.send('Index Get Request');
});

// POST request for /register endpoint
router.post('/register', async(req, res) => {
  // get required fields to register from request body which has sent by client
  const {
    name,
    surname,
    username,
    password,
    phoneNumber,
    emailAddress,
  } = req.body;

  // auto-gen a salt and hash,
  bcrypt.hash(password, 10, (err, hash) => {
    // hash variable represents that hashed form for our plain password
    if (err) throw err; // error handling
  });

  // generate new user on db
  const userGenerated = await User.create({
    name,
    surname,
    username,
    password,
    phoneNumber,
    emailAddress,
  });

  res.send(userGenerated._id)
});

// POST request for /login endpoint
router.post('/login', (req, res) => {
  const {username, password} = req.body;
});

export default router;
