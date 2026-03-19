const { Supplier } = require('../models');

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, contact_person, phone, email, address } = req.body;
    const newSupplier = await Supplier.create({ name, contact_person, phone, email, address });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Supplier.update(req.body, { where: { id } });
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(id);
      return res.json(updatedSupplier);
    }
    return res.status(404).json({ message: 'Supplier not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.destroy({ where: { id } });
    if (deleted) {
      return res.json({ message: 'Supplier deleted' });
    }
    return res.status(404).json({ message: 'Supplier not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
