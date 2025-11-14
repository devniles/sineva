const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Models
require('./models/Persona');
require('./models/User'); // 👈 NEW - User model for login/register

console.log("Loaded ENV:", {
  token: process.env.META_ACCESS_TOKEN,
  account: process.env.META_AD_ACCOUNT_ID,
  page: process.env.META_PAGE_ID,
  mongo: process.env.MONGO_URI ? "SET" : "NOT SET",
  jwt: process.env.JWT_SECRET ? "SET" : "NOT SET",
});

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/personas', require('./routes/personas'));
app.use('/api/meta', require('./routes/metaAds'));
app.use('/api/auth', require('./routes/auth')); // 👈 NEW: Login/Register route added

app.get('/', (req, res) => res.json({ message: 'Sineva AI Backend Running!' }));

// ============================
//   MONGODB CONNECT SYSTEM
// ============================
const connectWithFallback = async () => {
  const configured = process.env.MONGO_URI;
  const localFallback = 'mongodb://127.0.0.1:27017/sineva_ai';

  const tryConnect = async (uri) => {
    try {
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected successfully to', uri);
      return true;
    } catch (err) {
      console.log('❌ MongoDB error when connecting to', uri, '\n', err.message);
      return err;
    }
  };

  if (configured) {
    const result = await tryConnect(configured);

    if (result !== true) {
      if (
        String(result).includes('querySrv') ||
        String(result).includes('ENOTFOUND') ||
        String(result).includes('ECONNREFUSED')
      ) {
        console.log('Attempting fallback to local MongoDB at', localFallback);

        const fallbackResult = await tryConnect(localFallback);
        if (fallbackResult === true) return;
      }

      console.log('\nAction required:');
      console.log('- Check MONGO_URI in .env');
      console.log('- Ensure Atlas cluster IP whitelist');
      console.log('- Or install local MongoDB');
      process.exit(1);
    }
  } else {
    console.log('No MONGO_URI found. Trying local MongoDB at', localFallback);
    const fallbackResult = await tryConnect(localFallback);

    if (fallbackResult !== true) {
      console.log('Local MongoDB connection failed. Set MONGO_URI or start MongoDB.');
      process.exit(1);
    }
  }
};

connectWithFallback();

// ============================
//     START SERVER
// ============================
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
