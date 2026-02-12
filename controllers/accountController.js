const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createDeposit = async (req, res) => {
    const { amount, coin, walletAddress } = req.body;

    try {
        const transaction = await Transaction.create({
            userId: req.user._id,
            type: 'deposit',
            amount: Number(amount),
            coin,
            walletAddress,
            status: 'pending'
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Deposit Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const createWithdrawal = async (req, res) => {
    const { amount, method, pin, ...details } = req.body;
    // details can include coin, walletAddress, bankName, accountNumber, accountName, swiftCode, paypalEmail

    try {
        const user = await User.findById(req.user._id);

        // 1. Verify PIN
        if (!user.withdrawalPin) {
            return res.status(400).json({ message: 'Withdrawal PIN not set. Please set it in your profile.' });
        }

        const isPinMatch = await bcrypt.compare(pin, user.withdrawalPin);
        if (!isPinMatch) {
            return res.status(401).json({ message: 'Incorrect withdrawal PIN' });
        }

        // 2. Check Balance
        const account = await Account.findOne({ userId: req.user._id });
        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // 3. Create Transaction
        const transactionData = {
            userId: req.user._id,
            type: 'withdraw',
            amount,
            method,
            ...details
        };

        const transaction = await Transaction.create(transactionData);
        res.status(201).json(transaction);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
};

module.exports = { createDeposit, createWithdrawal, getTransactions };
