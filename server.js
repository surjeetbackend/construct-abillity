const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv = require('dotenv');
const app=express();
require('dotenv').config();
app.use(cors());
app.use(express.json());


const PORT=process.env.PORT|| 5000;

const getqoute=require('./routes/getqoute');
const newsslatter=require('./routes/newlatter')

app.use('/api/getquote',getqoute);
app.use('/api/newlatter',newsslatter)



mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
