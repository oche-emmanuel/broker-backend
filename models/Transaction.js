const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['crypto', 'bank', 'paypal'], default: 'crypto' },
    // Crypto details
    coin: { type: String },
    walletAddress: { type: String },
    // Bank details
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    swiftCode: { type: String },
    // PayPal details
    paypalEmail: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
