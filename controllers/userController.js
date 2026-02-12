const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Account = require('../models/Account');

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    const account = await Account.findOne({ userId: req.user._id });

    if (user) {
        const userData = { ...user._doc };
        userData.hasWithdrawalPin = !!userData.withdrawalPin;
        delete userData.withdrawalPin;

        res.json({
            user: userData,
            account
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getReferrals = async (req, res) => {
    const referrals = await User.find({ referredBy: req.user.referralCode }).select('name email registrationDate');
    res.json(referrals);
};

const setWithdrawalPin = async (req, res) => {
    const { pin } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const salt = await bcrypt.genSalt(10);
        user.withdrawalPin = await bcrypt.hash(pin, salt);
        await user.save();
        res.json({ message: 'Withdrawal PIN set successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, getReferrals, setWithdrawalPin };
