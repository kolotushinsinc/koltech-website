import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin';

// Load environment variables
dotenv.config();

const createAdmin = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koltech-crm';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'koltechadmin@koltech.dev';
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists`);
      process.exit(0);
    }

    // Create new admin
    const adminPassword = process.env.ADMIN_PASSWORD || 'uaLNB408WHZOIjN2';
    const newAdmin = new Admin({
      email: adminEmail,
      password: adminPassword
    });

    await newAdmin.save();
    console.log(`Admin created successfully with email: ${adminEmail}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();