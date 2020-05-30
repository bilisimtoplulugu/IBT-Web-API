/* Packages I used */
import express from 'express';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';

/* MongoDB Models */
import User from '../models/user';
import Event from '../models/event';
import sendCodeToVerifyEmail from '../utils/sendCodeToVerifyEmail';
import checkFileType from '../utils/checkFileType';

const router = express.Router(); // call express.Router function to provide route

// POST request for /user/register endpoint
router.post('/register', async (req, res) => {
  const {email, password} = req.body;

  // hash variable represents that hashed form for our plain password
  const hash = await bcrypt.hash(password, 10);

  req.body.username = email.split('@')[0];
  req.body.password = hash;

  // generate new user on db
  const userGenerated = await User.create(req.body);

  res.send(userGenerated._id);
});

// POST request for /user/login endpoint
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  // find user by email (username also valid) came from client
  const user = await User.findOne().or([{email}, {username: email}]);

  if (!user) return res.status(404).send('User not found.');

  // compare operation between hashed password and plain text password came from client
  const match = await bcrypt.compare(password, user.password);

  // if matches login success
  if (!match) return res.status(401).send('Incorrect Pass');

  const eventDetails = await Event.find(
    {
      _id: {$in: user.joinedEvents},
    },
    {joinedEvents: {$slice: 4}}
  );
  user.joinedEvents = eventDetails;
  console.log(eventDetails);

  const token = await jwt.sign({user}, process.env.JWT_SECRET_KEY);
  res.json({user, token});
});

router.post('/auth', async (req, res) => {
  const {token} = req.body;
  console.log('auth');
  try {
    const {
      user: {_id},
    } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    let user = await User.findById(_id);
    const eventDetails = await Event.find(
      {_id: {$in: user.joinedEvents}},
      {joinedEvents: {$slice: 4}}
    );
    //console.log(user)
    //console.log(eventDetails)
    /* let y = user;
let x = {...y,a:1}
console.log({x:{_doc}}) */

    //user = {...user, eventDetails};

    //x.eventDetails = eventDetails;
    //console.log(x.eventDetails)
    //user.eventDetails = eventDetails;
    return res.send(user);
  } catch (e) {
    console.log(e);

    return res.status(400).send('Invalid token.');
  }
});

router.post('/send-code-to-email', async (req, res) => {
  const {emailTo} = req.body;
  const confirmCode = randomstring.generate(6);

  if (!emailTo) return res.status(400).send('Please fill all fields.');

  const isRegistered = await User.findOne({email: emailTo});

  if (isRegistered)
    return res.status(400).send('This e-mail address already registered.');

  console.log(confirmCode);
  //await sendCodeToVerifyEmail(emailTo, confirmCode);
  const token = await jwt.sign(
    {email_verification: confirmCode},
    process.env.JWT_SECRET_KEY
  );
  res.send(token);
});

router.post('/email-verification', async (req, res) => {
  const {code, token} = req.body;

  if (!code || !token) return res.status(400).send('Please fill all fields.');

  try {
    const {email_verification} = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // incorrect confirm code
    if (code !== email_verification)
      return res.status(401).send('Incorrect Confirm Code');

    res.send();
  } catch (e) {
    res.status(401).send('Invalid Token');
  }
});

router.get('/last-events', async (req, res) => {
  const {userId} = req.query;
  if (!userId) return res.status(400).send('Please fill all fields.');

  const user = await User.findById(userId).select({
    joinedEvents: 1,
  });
  const eventDetails = await Event.find({_id: {$in: user.joinedEvents}});
  res.send(eventDetails);
});

router.patch('/change-password', async (req, res) => {
  const {userId, oldPass, newPass, newPassAgain} = req.body;
  if (!userId || !oldPass || !newPass || !newPassAgain)
    return res.status(400).send('Please fill all fields.');

  if (newPass !== newPassAgain)
    return res.status(400).send('Password does not match.');

  const user = await User.findById(userId);
  if (!user) return res.status(404).send('User not found.');

  const passCheck = await bcrypt.compare(oldPass, user.password);
  if (!passCheck) return res.status(400).send('Incorrect old password.');

  const hash = await bcrypt.hash(newPass, 10);
  user.password = hash;
  user.save();

  res.send();
});

router.patch('/change-personal', async (req, res) => {
  const {userId, name, surname, email} = req.body;
  if (!userId || !name || !surname || !email)
    return res.status(400).send('Please fill all fields.');

  const user = await User.findById(userId);
  if (!user) return res.status(404).send('User not found.');

  user.name = name;
  user.surname = surname;
  user.email = email;
  user.save();

  res.send();
});

var upload = multer({
  storage: multer.diskStorage({
    destination: './assets/images',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.patch('/change-profile-photo', upload.single('post-image'), async (req, res) => {
  //console.log(req.file.path)
  console.log(req.body)
  res.send();
});

export default router;
