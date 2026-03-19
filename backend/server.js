require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running perfectly!' });
});

try {
  const { sequelize } = require('./models');
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const supplierRoutes = require('./routes/supplierRoutes');
  const customerRoutes = require('./routes/customerRoutes');
  const saleRoutes = require('./routes/saleRoutes');
  const purchaseRoutes = require('./routes/purchaseRoutes');
  const dashboardRoutes = require('./routes/dashboardRoutes');
  const reportRoutes = require('./routes/reportRoutes');
  const userRoutes = require('./routes/userRoutes');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/suppliers', supplierRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/sales', saleRoutes);
  app.use('/api/purchases', purchaseRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/users', userRoutes);

  // Database Sync & Server Start
  const PORT = process.env.PORT || 5000;

  sequelize.authenticate()
    .then(() => {
      console.log('MySQL Database connected successfully.');
      return sequelize.sync();
    })
    .then(() => {
      if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      }
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

} catch (error) {
  // If anything crashes during initialization (e.g. missing DB_NAME), serve the exact error!
  app.all('*', (req, res) => {
    res.status(500).json({
      error: 'Backend Initialization Crashed',
      message: error.message,
      missingDBName: !process.env.DB_NAME,
      missingDBUser: !process.env.DB_USER,
      missingDBHost: !process.env.DB_HOST,
      missingDBPassword: !process.env.DB_PASSWORD,
      stack: error.stack
    });
  });
}

module.exports = app;
