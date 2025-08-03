const mongoose = require('mongoose');

const transaction = (fn) => async (req, res, next) => {
    const session = await mongoose.connection.startSession();
    
    try {
        await session.startTransaction();
        await fn(req, res, session);
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        console.log('Transaction aborted:', err.message);
        next(err);
    } finally {
        await session.endSession();
    }
};

const transactionSimple = (fn) => async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => await fn(req, res, session));
    } catch(err) {
        console.log('Transaction error:', err.message);
        next(err);
    } finally {
        await session.endSession();
    }
};

module.exports = { transaction, transactionSimple };