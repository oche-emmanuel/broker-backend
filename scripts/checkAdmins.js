const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const listAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await User.find({ role: 'admin' }).select('email name');
        if (admins.length > 0) {
            console.log('Existing Admin Users:');
            admins.forEach(admin => console.log(`- ${admin.name} (${admin.email})`));
        } else {
            console.log('No admin users found.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

listAdmins();
