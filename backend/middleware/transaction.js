const mongoose = require('mongoose');

const transaction = (fn) => async (req, res, next) => {
    // Start session and transaction
    const session = await mongoose.connection.startSession();
    await session.startTransaction();

    // set current session, it will be useable by fn
    //req.transactionSession = session;

    // Execute action and catch errors
    Promise.resolve(fn(req, res, session, next))
    .then(async () => {
        await session.commitTransaction();
        // Don't call next() here as the function should handle the response
    })
    .catch(async (err) => {
        await session.abortTransaction();
        console.log('Transaction aborted:', err.message);
        next(err);
    })
    .finally(async () => {
        await session.endSession();
    });
}

const transactionSimple = (fn) => async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => await fn(req, res, session));
        session.endSession();
        // Don't call next() here as the function should handle the response
    } catch(err) {
        session.endSession();
        console.log('Transaction error:', err.message);
        next(err);
    }
}

module.exports = {transaction, transactionSimple};