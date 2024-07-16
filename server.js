const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/userData');
const cron = require('node-cron');
const { sendWeatherReport } = require('./utils/weather');
const userRoutes = require('./routes/userRoute');
const config = require('./config.json');
const axios = require('axios');

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const port = 3000;

// Serve static files from the public directory
app.use(express.static('Frontend'));

// API route to fetch weather data by city
app.get('/api/weather/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${config.API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

//Connect MongoDB cloud database
const DB_URL = "mongodb+srv://Test1:Test1@cluster1.lshemxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

  mongoose.connect(DB_URL)
  .then(()=>{
      console.log('DB connected!');
  })
  .catch((err)=>console.log("Db connected faild!", err));

  // Use user routes
  app.use('/', userRoutes);


// Sechedule to send weather reports every 3 hours
cron.schedule('0 0 */3 * * *', async () => {
  const users = await User.find();

  for (const user of users) {
      try {
          await sendWeatherReport(user);
      } catch (error) {
          console.error(`Failed to send weather report to ${user.email}:`, error);
      }
  }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
