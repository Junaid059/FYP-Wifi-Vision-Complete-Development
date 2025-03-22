import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import adminroutes from './src/routes/admin.route.js';
const app = express();
const PORT = 3000;

dotenv.config();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/WiVi')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/admin',adminroutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
