const { Customer } = require('../models');

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, points } = req.body;
    const newCustomer = await Customer.create({ name, phone, email, points: points || 0 });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Customer.update(req.body, { where: { id } });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(id);
      return res.json(updatedCustomer);
    }
    return res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { id } });
    if (deleted) {
      return res.json({ message: 'Customer deleted' });
    }
    return res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
