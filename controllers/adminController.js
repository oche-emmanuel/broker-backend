const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'accounts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'account'
                }
            },
            { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    password: 0
                }
            }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAccount = async (req, res) => {
    const { userId, balance, activeDeposit, bonus, manager, accountStatus } = req.body;

    const account = await Account.findOneAndUpdate(
        { userId },
        { balance, activeDeposit, bonus, manager },
        { new: true }
    );

    if (accountStatus) {
        await User.findByIdAndUpdate(userId, { accountStatus });
    }

    res.json(account);
};

const updateTransactionStatus = async (req, res) => {
    const { transactionId, status } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = status;
    await transaction.save();

    // If approved deposit, update balance automatically
    if (status === 'approved' && transaction.type === 'deposit') {
        const account = await Account.findOne({ userId: transaction.userId });
        account.balance += transaction.amount;
        await account.save();
    }

    // If approved withdrawal, deduct balance
    if (status === 'approved' && transaction.type === 'withdraw') {
        const account = await Account.findOne({ userId: transaction.userId });
        account.balance -= transaction.amount;
        await account.save();
    }

    res.json(transaction);
};

const getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, updateAccount, updateTransactionStatus, getUserTransactions };
