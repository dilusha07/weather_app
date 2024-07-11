const express = require('express');

const app = express();
app.use(express.json());

const port = 3000;

// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
