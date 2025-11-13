// server/models/Persona.js
const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
  productName: String,
  category: String,
  targetMarket: String,
  objective: String,
  keywords: [String],
  personas: [
    {
      name: String,
      ageRange: String,
      occupation: String,
      interests: [String],
      painPoints: [String],
      messagingHooks: [String],
    },
  ],
  summary: String,
  toneRecommendation: String,
}, { timestamps: true });

module.exports = mongoose.model('Persona', PersonaSchema);
