const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@lenslink.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists with email: admin@lenslink.com');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash('admin123456', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@lenslink.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1234567890',
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Admin Credentials:');
    console.log('   Email:    admin@lenslink.com');
    console.log('   Password: admin123456');
    console.log('');
    console.log('🔗 Access admin panel: http://localhost:3000/admin');
    console.log('');
    console.log('⚡ Important: Change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdminUser();
