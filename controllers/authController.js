const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, referralCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique referral code for the new user
    const personalReferralCode = Math.random().toString(36).substring(7).toUpperCase();

    const user = await User.create({
        name,
        email,
        password,
        referralCode: personalReferralCode,
        referredBy: referralCode // Code provided by someone else
    });

    if (user) {
        // Create an empty account for the new user
        await Account.create({ userId: user._id });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate,
            referralCode: user.referralCode,
            accountStatus: user.accountStatus,
            hasWithdrawalPin: !!user.withdrawalPin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`User not found for email: ${email}`);
    } else {
        const isMatch = await user.matchPassword(password);
        console.log(`User found. Password match: ${isMatch}`);
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate,
            referralCode: user.referralCode,
            accountStatus: user.accountStatus,
            hasWithdrawalPin: !!user.withdrawalPin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, loginUser };
