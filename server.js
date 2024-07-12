const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.json');
const User = require('./models/userData');

const app = express();
app.use(express.json());

const port = 3000;

// OpenWeatherMap API key
//const API_KEY = config.API_KEY;
//const OWM_API_KEY = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}`; 

//Connect MongoDB cloud database
const DB_URL = "mongodb+srv://Test1:Test1@cluster1.lshemxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
//https://cloud.mongodb.com/v2/65d46964c5235c503ca6e9d7#/metrics/replicaSet/6690ef5e29d9632d364642f5/explorer/test/users/find

  
  mongoose.connect(DB_URL)
  .then(()=>{
      console.log('DB connected!');
  })
  .catch((err)=>console.log("Db connected faild!", err));

  // async function checkWeather() {
  //   const response = await fetch(OWM_API_KEY);
  //   var data = await response.json();

  //   console.log(data);
  // }


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
// Example usage
getWeatherData("Colombo")
  .then((data) => {
    console.log(data); // Display the weather data for Mumbai
  })
  .catch((error) => {
    console.error(error);
  });

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

  // Store user details
app.post('/users', async (req, res) => {
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

// update user's location
app.put('/users/:email', async (req, res) => {
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
app.get('/users/:email/weather', async (req, res) => {
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
app.delete('/users/:email', async (req, res) => {
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
