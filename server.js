const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userData');
const cron = require('node-cron');
const { sendWeatherReport } = require('./utils/weather');
const userRoutes = require('./routes/userRoute');

const app = express();
app.use(express.json());

const port = 3000;

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
