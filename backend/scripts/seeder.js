const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Language = require('../models/locale/Language');
const Country = require('../models/locale/Country');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
mongoose.connect("mongodb+srv://coktasmuharremsait:LKugqDLBrkUAt3Bw@cluster0.devoclj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Language data
const languages = [
  {
    isoCode: "tr",
    name: "Türkçe",
    icon: "https://i.ibb.co/hRYWdRNJ/turkey.png"
  },
  {
    isoCode: "en",
    name: "English",
    icon: "https://i.ibb.co/Q37vzJsF/united-states.png"
  }
];

// Sample country data (you can expand this)
const countries = [
  {
    isoCode: "TR",
    englishName: "Turkey",
    icon: "https://i.ibb.co/hRYWdRNJ/turkey.png"
  },
  {
    isoCode: "US",
    englishName: "United States",
    icon: "https://i.ibb.co/Q37vzJsF/united-states.png"
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