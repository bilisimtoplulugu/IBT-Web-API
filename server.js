import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express();
const PORT = 2222 || process.env.PORT;
dotenv.config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, (err) => {
    if (err) throw err;
    console.log('Mongoose connected!');
});


app.listen(PORT,() => console.log(`Server is running on ${PORT}`))