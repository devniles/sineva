const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/personas', require('./routes/personas'));

app.get('/', (req, res) => res.json({ message: 'Sineva AI Backend Running!' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
