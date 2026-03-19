import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Shield } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Cashier' });
  const [editingRole, setEditingRole] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setFormData({ name: '', email: '', password: '', role: 'Cashier' });
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await api.put(`/users/${editingRole.id}/role`, { role: formData.role });
      } else {
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (currentUser?.role !== 'Admin') {
    return <div className="p-8 text-center text-red-600 font-bold">Access Denied. Admins only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Users</h1>
          <p className="text-slate-500 mt-1">Manage role-based access control (RBAC)</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div></div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-4 font-semibold text-sm">User Details</th>
                <th className="p-4 font-semibold text-sm">Role</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{u.name}</div>
                    <div className="text-sm text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                      u.role === 'Manager' ? 'bg-teal-100 text-teal-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 space-x-3">
                    <button 
                      onClick={() => { setEditingRole(u); setFormData({ ...formData, role: u.role }); setIsModalOpen(true); }}
                      className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Change Role"
                    >
                      <Shield size={18} />
                    </button>
                    {u.id !== currentUser.id && (
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRole ? "Change User Role" : "Add System User"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!editingRole && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-slate-700 font-bold mb-1 text-sm">System Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Cashier">Cashier</option>
              <option value="Manager">Inventory Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-200">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Users;
