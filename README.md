# Node.js Backend Application

## Introduction
This is a Node.js API that stores users' emails and locations, and automatically sends weather reports every 3 hours. It uses the OpenWeatherMap API to fetch weather data and Nodemailer to send email reports.

## Prerequisites
- Node.js
- MongoDB (You can use MongoDB Atlas for a cloud-based solution)
- Git
  
## Setup

1. Clone the repository:
   ```sh
   git clone  https://github.com/dilusha07/weather_app.git
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Configure your environment variables in a config.json file
5. Start the server using `npm start`.

## APIs

- POST /users - Store user details (email and location).
- PUT /users/:email - Update user's location.
- GET /users/:email/weather - Retrieve user's weather data for a given day.
- GET /weather - Fetch weather data for a specified city.
- DELETE /users/:email - Delete a user by email.
- POST /users/send-weather-report/:email - Trigger sending weather report email.

## Testing

- Test the routes using Postman

## Deployment

- Deploy on Vercel

## How to deploy this application on AWS

1. Install Elastic Beanstalk CLI: `pip install awsebcli`
2. Initialize the Application: `eb init -p node.js weather_app`
3. Create an Environment: `eb create weather-app-env`
4. Deploy the Application: `eb deploy`
