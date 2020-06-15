import express from 'express';
import mongoose from 'mongoose';
import asyncRedis from 'async-redis';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import api from './routes';

const app = express();
const PORT: number = 2222 || process.env.PORT;
const PORT_REDIS = 6379;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('assets'));
dotenv.config();

/* Redis Connection */
export const client = asyncRedis.createClient(PORT_REDIS);

/* Mongoose connection provider */
mongoose.connect(process.env.DB_URI!, {useNewUrlParser: true,useUnifiedTopology: true}, (err: any) => {
  if (err) throw err;
  console.log('Mongoose connected!');
});

/* mongoose package configuration */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/* app.get('/', (req, res) => {
    res.send('Index Get Request');
    }); */

app.use('/', api); // Use API router for all requests to this server

app.listen(PORT, () => console.log(`Server is running on ${PORT}`)); // Run server
