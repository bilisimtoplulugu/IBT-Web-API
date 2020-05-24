/* Packages I used */
import express from 'express';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';

/* MongoDB Models */
import User from '../models/user/index';
import sendCodeToVerifyEmail from '../utils/sendCodeToVerifyEmail';

const router = express.Router(); // call express.Router function to provide route

// POST request for /user/register endpoint
router.post('/register', async (req, res) => {
  const {password} = req.body;

  // hash variable represents that hashed form for our plain password
  const hash = await bcrypt.hash(password, 10);

  req.body.password = hash;

  // generate new user on db
  const userGenerated = await User.create(req.body);

  res.send(userGenerated._id);
});

// POST request for /user/login endpoint
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  // find user by email came from client
  const doc = await User.findOne().or([{email}, {username: email}]);

  // compare operation between hashed password and plain text password came from client
  const match = await bcrypt.compare(password, doc.password);

  // if matches login success
  if (!match) return res.status(401).send('Incorrect Pass');

  const token = await jwt.sign({doc}, process.env.JWT_SECRET_KEY);
  console.log(token)
  res.json({doc,token})
});

router.post('/confirmEmail', async (req, res) => {
  const {code, token} = req.body;
  console.log(code)
  console.log(token)

  try {
    const {email_verification} = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // compare confirm code
    if (code === email_verification) return res.send();

    // incorrect confirm code
    return res.status(401).send('Incorrect Confirm Code');
  } catch (e) {
    res.status(401).send('Invalid Token');
  }
});

router.post('/auth', async (req, res) => {
  const {token} = req.body;
  try {
    const {
      user: {_id},
    } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(_id);
    return res.send(user);
  } catch (e) {
    return res.status(400).send('Invalid token.');
  }
});

router.post('/email-verification', async (req, res) => {
  const {email} = req.body;
  const confirmCode = randomstring.generate(6);

  if (!email) return res.status(400).send('Please fill all fields.');

  console.log(confirmCode);
  //await sendCodeToVerifyEmail(email, confirmCode);
  const token = await jwt.sign(
    {email_verification: confirmCode},
    process.env.JWT_SECRET_KEY
  );
  res.send(token);
});

export default router;
