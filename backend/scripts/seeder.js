const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Language = require('../models/locale/Language');
const Country = require('../models/locale/Country');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Language data
const languages = [
  {
    isoCode: "tr",
    name: "Türkçe",
    icon: ""
  },
  {
    isoCode: "en",
    name: "English",
    icon: ""
  }
];

// Sample country data (you can expand this)
const countries = [
  {
    isoCode: "TR",
    englishName: "Turkey",
    icon: ""
  },
  {
    isoCode: "US",
    englishName: "United States",
    icon: ""
  }
];

// Import data
const importData = async () => {
  try {
    await Language.deleteMany();
    await Country.deleteMany();

    await Language.create(languages);
    await Country.create(countries);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Language.deleteMany();
    await Country.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} 