const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true
    },
    location: {
      type: String,
      required: [true, 'Please enter a user location'],
    },
    weatherData: [
        {
            date: { 
                type: Date, 
                required: true 
           },
            data: { 
                type: Object, 
                required: true 
           }
        }
    ]
  });

  const User = mongoose.model('user', userData);

  module.exports = User;