const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.json');
const User = require('./models/userData');

const app = express();
app.use(express.json());

const port = 3000;

//Connect MongoDB cloud database
const DB_URL = "mongodb+srv://Test1:Test1@cluster1.lshemxo.mongodb.net/TestAPP?retryWrites=true&w=majority";
  
  mongoose.connect(DB_URL)
  .then(()=>{
      console.log('DB connected!');
  })
  .catch((err)=>console.log("Db connected faild!", err));


// Function to fetch weather data
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

// getWeatherData("Colombo")
//   .then((data) => {
//     console.log(data); // Display the weather data for Colombo
//   })
//   .catch((error) => {
//     console.error(error);
//   });

  // GET route to fetch weather data for a specified city
app.get('/weather', async (req, res) => {
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
