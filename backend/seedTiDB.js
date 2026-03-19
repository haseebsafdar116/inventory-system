const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      multipleStatements: true,
      ssl: {
          rejectUnauthorized: true
      }
    });

    console.log('Connected to TiDB Cloud!');
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    const sqlPath = path.join(__dirname, '..', 'database_schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database_schema.sql...');
    await connection.query(sqlScript);

    console.log('Database seeded successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
