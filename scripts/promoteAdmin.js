const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const promoteAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide a user email: node promoteAdmin.js user@example.com');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database');

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        console.log(`Success! User ${user.email} is now an ADMIN.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

promoteAdmin();
