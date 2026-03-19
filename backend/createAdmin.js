const bcrypt = require('bcrypt');
const { User } = require('./models');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@store.com' },
      defaults: {
        name: 'Super Admin',
        password_hash: hashedPassword,
        role: 'Admin'
      }
    });

    if (!created) {
      user.password_hash = hashedPassword;
      await user.save();
      console.log('✅ Updated existing admin@store.com password to: password123');
    } else {
      console.log('✅ Created new admin@store.com password: password123');
    }
    
    console.log('You can now log in successfully! Press Ctrl+C to exit this script.');
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();
