import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Trash2, Search, UserCircle } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import Modal from '../components/Modal';

const Customers = () => {
  const { customers, loadingCustomers, fetchCustomers } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  // Remove local fetchCustomers and useEffect

  const handleOpenModal = (customer = null) => {
    setEditingCustomer(customer);
    setFormData(customer ? { name: customer.name, phone: customer.phone, email: customer.email } : { name: '', phone: '', email: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) await api.put(`/customers/${editingCustomer.id}`, formData);
      else await api.post('/customers', formData);
      setIsModalOpen(false);
      fetchCustomers(true);
    } catch (error) { alert('Error saving customer'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete customer?')) {
      await api.delete(`/customers/${id}`);
      fetchCustomers(true);
    }
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.phone && c.phone.includes(searchTerm)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus size={20} /><span>Add Customer</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input type="text" placeholder="Search customers..." className="bg-transparent outline-none w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        {(!loadingCustomers || customers.length > 0) && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Loyalty Points</th>
                {['Admin', 'Manager'].includes(user?.role) && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="p-4 flex items-center gap-2"><UserCircle size={18} className="text-gray-500"/>{c.name}</td>
                  <td className="p-4">{c.phone || '-'}</td>
                  <td className="p-4">{c.email || '-'}</td>
                  <td className="p-4 font-bold text-indigo-600">{c.points}</td>
                  {['Admin', 'Manager'].includes(user?.role) && (
                    <td className="p-4 text-right">
                      <button onClick={() => handleOpenModal(c)} className="text-blue-600 p-2"><Edit size={18}/></button>
                      {user?.role === 'Admin' && <button onClick={() => handleDelete(c.id)} className="text-red-600 p-2"><Trash2 size={18}/></button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? "Edit" : "Add"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Name *" className="w-full p-2 border rounded" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
          <div className="flex justify-end gap-2"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
