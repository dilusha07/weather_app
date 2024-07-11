const express = require('express');
const mongoose = require('mongoose');

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


// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
