// server.js (Updated for Deployment)
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// --- SECURE CORS CONFIGURATION ---
// This tells your server to only accept requests from your local frontend
// and your future live frontend URL (which we'll set during deployment).
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// --- END OF UPDATE ---


// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/campaigns', require('./routes/campaigns'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));