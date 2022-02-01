const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection established'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

// Import tours in DB
const importDevData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours created in DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete touts from DB
const deleteDevData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted from DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// process.argv is a list of command line arguments:
// [
//     '/Users/georgeusynin/.nvm/versions/node/v14.17.1/bin/node',
//     '/Users/georgeusynin/node-udemy/natours/dev-data/data/import-dev-data.js',
//     '--import'
//   ]
if (process.argv[2] === '--import') {
  importDevData();
} else if (process.argv[2] === '--delete') {
  deleteDevData();
}
