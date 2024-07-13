const express = require('express');
const User = require('../models/userData');
const config = require('../config.json');
const { sendWeatherReport } = require('../utils/weather');

const router = express.Router();

// Fetch weather data using OpenWeatherMap API
async function getWeatherData(city) {
    const apiKey = config.API_KEY;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
   
    try {
      const response = await fetch(weatherURL);
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.log("Error fetching weather data:", error);
      throw error;
    }
  }

    // GET route to fetch weather data for a specified city
    router.get('/weather', async (req, res) => {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).send({ error: 'City is required' });
    }
  
    try {
      const weatherData = await getWeatherData(city);
      res.send(weatherData);
    } catch (error) {
      res.status(500).send({ error: 'Error fetching weather data' });
    }
  });
  
    // Store user details
    router.post('/users', async (req, res) => {
    const { email, location } = req.body;
  
    const weatherData = await getWeatherData(location.city);
  
    const user = new User({
        email,
        location,
        weatherData: [
            {
                date: new Date(),
                data: weatherData,
            },
        ],
    });
    await user.save();
  
    res.status(201).send(user);
  });
  
  // Update user's location
  router.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const { location } = req.body;
  
    const weatherData = await getWeatherData(location.city);
  
    const user = await User.findOneAndUpdate({ email }, { location }, { new: true });
  
    if (!user) {
        return res.status(404).send('User not found');
    }
  
    user.weatherData.push({
        date: new Date(),
        data: weatherData,
    });
    await user.save();
  
    res.send(user);
  });
  
  // Get user's weather data by given day
  router.get('/users/:email/weather', async (req, res) => {
    const { email } = req.params;
    const { date } = req.query;
  
    const user = await User.findOne({ email });
  
    if (!user) {
        return res.status(404).send('User not found');
    }
  
    const weatherData = user.weatherData.filter(data => new Date(data.date).toDateString() === new Date(date).toDateString());
  
    res.send(weatherData);
  });
  
  
  // Delete a user by email
  router.delete('/users/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOneAndDelete({ email });
  
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      res.send({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while deleting the user' });
    }
  });
  
// Trigger sending weather report email
router.post('/users/send-weather-report/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        await sendWeatherReport(user);
        res.send('Weather report sent successfully');
    } catch (error) {
        console.error(`Failed to send weather report to ${email}:`, error);
        res.status(500).send('Failed to send weather report');
    }
});

module.exports = router;