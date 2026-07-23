const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing from .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to database successfully.');

    const email = 'admin@dealership.com';
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`Updated existing user to Admin: ${email}`);
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        email,
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Admin user created successfully!');
      console.log(`Email: ${email}`);
      console.log('Password: admin123');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

seed();
