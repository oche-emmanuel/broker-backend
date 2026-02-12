const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyUser = async () => {
    const email = 'ahmcoker20@gmail.com';
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (user) {
            console.log(`Database Record:
- Name: ${user.name}
- Email: ${user.email}
- Role: ${user.role}
- ID: ${user._id}`);
        } else {
            console.log('User not found in database.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

verifyUser();
