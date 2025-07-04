const mongoose = require("mongoose");

const LanguageSchema = new mongoose.Schema({
  isoCode: {
    type: String,
    required: [true, "Language must have a iso code"],
    unique: [true, "ISO Code must be unique"],
  },
  name: {
    type: String,
    required: [true, "It needs to have a name in that language"],
  },
  icon: {
    type: String,
    required: [true, "Language must have an icon"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Language", LanguageSchema);
