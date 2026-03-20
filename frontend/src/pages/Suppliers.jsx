import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import Modal from '../components/Modal';

const Suppliers = () => {
  const { suppliers, loadingSuppliers, fetchSuppliers } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '', contact_person: '', phone: '', email: '', address: ''
  });

  // Remove local fetchSuppliers and useEffect

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setIsModalOpen(false);
      fetchSuppliers(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving supplier');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers(true);
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting supplier');
      }
    }
  };

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
        {['Admin', 'Manager'].includes(user?.role) && (
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} /><span>Add Supplier</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="bg-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loadingSuppliers && suppliers.length === 0 ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-4">Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                {['Admin', 'Manager'].includes(user?.role) && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(supplier => (
                <tr key={supplier.id} className="border-b border-gray-100 hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                     <Users size={18} className="text-indigo-600"/> 
                     <span className="font-semibold">{supplier.name}</span>
                  </td>
                  <td className="p-4">{supplier.contact_person || '-'}</td>
                  <td className="p-4">{supplier.phone || '-'}</td>
                  <td className="p-4">{supplier.email || '-'}</td>
                  {['Admin', 'Manager'].includes(user?.role) && (
                    <td className="p-4 text-right space-x-2">
                       <button onClick={() => handleOpenModal(supplier)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                       {user?.role === 'Admin' && (
                         <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                       )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Supplier Name *" className="w-full p-2 border rounded" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Contact Person" className="w-full p-2 border rounded" value={formData.contact_person} onChange={e=>setFormData({...formData, contact_person: e.target.value})} />
          <input type="text" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
          <textarea placeholder="Address" className="w-full p-2 border rounded" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})}></textarea>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
