//Importing Node.js modules
const express = require('express');
const mongoose = require('mongoose');
const Log = require('./log'); 

// Initialize Express app
const app = express();

// Using express.json() to parase bodies 
app.use(express.json());

// Connecting  to MongoDB
mongoose.connect('mongodb://localhost:27017/logdb')
.then(() => {
  console.log('Connected to MongoDB...');

  // Choose the port where to listen on
  const PORT = process.env.PORT || 3000;

 
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Endpoint to ingest the new logs
  app.post('/logs', async (req, res) => {
    try {
      const log = new Log(req.body);
      await log.save(); 
      res.status(201).send(log); 
    } catch (error) {
      res.status(500).send({ message: error.message }); //gives error response if something is wrong
    }
  });

  // Endpoint of the query logs
  app.get('/logs', async (req, res) => {
    try {
      const filters = req.query; 
      const logs = await Log.find(filters);
      res.send(logs); 
    } catch (error) {
      res.status(500).send({ message: error.message }); 
    }
  });

})
.catch(err => {
  console.error('Could not connect to MongoDB...', err);
});