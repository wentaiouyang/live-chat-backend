// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Hello Express Backend 🚀');
});

// example API
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Owen' },
    { id: 2, name: 'Alice' },
  ]);
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
