const axios = require('axios');
const nodemailer = require('nodemailer');
const config = require('../config.json');

//const OpenAI = require('openai');

// Initialize OpenAI with API key
// const openai = new OpenAI({
//     apiKey: config.OPENAI_API_KEY,
// });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    },
});

//Get weather data
const getWeatherData = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${config.API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

// Generate weather text using OpenAI
// const generateWeatherText = async (weatherData) => {
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a helpful assistant."
//                 },
//                 {
//                     role: "user",
//                     content: `Write a detailed weather report. Temperature: ${weatherData.main.temp} °C, Weather: ${weatherData.weather[0].description}, Humidity: ${weatherData.main.humidity}%, Wind Speed: ${weatherData.wind.speed} m/s.`
//                 }
//             ],
//         });
//         return response.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error generating weather text:', error);
//         throw error;
//     }
// };

// Generate weather text using Gemini API
async function generateWeatherText(weatherData) {
    const geminiApiKey = config.GEMINI_API_KEY;
    const geminiUrl = 'https://api.gemini.com/v1/generate-weather-text';
  
    const requestBody = {
      model: 'gemini-weather-model',
      weather: weatherData
    };
  
    try {
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${geminiApiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      const geminiResponse = await response.json();
      return geminiResponse.generatedText;
    } catch (error) {
      console.log("Error generating weather text:", error);
      throw error;
    }
  }
  
// Send email
const sendWeatherReport = async (user) => {
    const weatherData = await getWeatherData(user.location.city);
    const weatherText = await generateWeatherText(weatherData);

    const mailOptions = {
        from: config.GMAIL_USER,
        to: user.email,
        subject: 'Weather Report',
        text: `
            Current weather for your location:
            ${weatherText}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Save weather data to the database
    user.weatherData.push({
        date: new Date(),
        data: weatherData,
    });
    await user.save();
};

module.exports = {
    getWeatherData,
    generateWeatherText,
    sendWeatherReport,
};
