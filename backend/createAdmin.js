const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: {
          rejectUnauthorized: true
      }
    });

    console.log('Connected to TiDB Cloud!');
    
    const email = 'admin@store.com';
    const password = 'admin'; // Kept it super simple for testing!
    
    // Check if admin exists
    const [rows] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Admin user already exists!');
      await connection.end();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert admin
    const now = new Date();
    await connection.query(
      'INSERT INTO Users (name, email, password_hash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin User', email, password_hash, 'Admin', now, now]
    );

    console.log('-----------------------------------------');
    console.log('✅ Admin user created SUCCESSFULLY!');
    console.log('📧 Email: admin@store.com');
    console.log('🔑 Password: admin');
    console.log('-----------------------------------------');
    
    await connection.end();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
