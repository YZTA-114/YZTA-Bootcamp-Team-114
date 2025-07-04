const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        { 
        }
    )

    const db = mongoose.connection;
    db.on('error', error => {
        throw new Error(`error connecting to db: ${error}`);
    })
    db.once('open', () => console.log('database connected'));
}