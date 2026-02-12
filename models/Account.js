const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    activeDeposit: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    manager: { type: String, default: 'Unassigned' }
});

module.exports = mongoose.model('Account', accountSchema);
