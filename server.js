require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MenuItem = require('./models/MenuItem');

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes

// Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required fields.' });
    }

    const menuItem = new MenuItem({ name, description, price });
    const savedItem = await menuItem.save();
    res.status(201).json({ message: 'Menu item created successfully!', data: savedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
