const mongoose = require("mongoose");

const CountryTranslationSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  translatedName: {
    type: String,
    required: [true, "CountryTranslation must have a translatedName"],
    unique: [true, "Translated name must be unique"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a compound index to ensure the combination of `country` and `language` is unique
CountryTranslationSchema.index({ country: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("CountryTranslation", CountryTranslationSchema);
