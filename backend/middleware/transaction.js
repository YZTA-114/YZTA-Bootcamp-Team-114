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
    })
    .catch(async (err) => {
        await session.abortTransaction();
        console.log('Transaction aborted')
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
        next();
    } catch(err) {
        //wait session.abortTransaction();
        session.endSession();
        console.log(err);
        next(err);
    }
   
}


module.exports = {transaction, transactionSimple};