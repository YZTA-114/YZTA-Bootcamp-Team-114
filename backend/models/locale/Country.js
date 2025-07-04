const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  isoCode: {
    type: String,
    required: [true, "Country must have a iso code"],
    unique: [true, "ISO Code must be unique"],
  },
  englishName: {
    type: String,
    required: [true, "Country must have a name in english"],
  },
  icon: {
    type: String,
    required: [true, "Country must have an icon"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Country", CountrySchema);
