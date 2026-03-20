import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search, Truck } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import Modal from '../components/Modal';

const Purchases = () => {
  const { 
    purchases, loadingPurchases, fetchPurchases, 
    products, fetchProducts,
    suppliers, fetchSuppliers,
    fetchStats 
  } = useContext(DataContext);
  
  const { user } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ supplierId: '', productId: '', quantity: '', unit_cost: '' });

  // Remove local fetchData and useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/purchases', {
        ...formData,
        quantity: parseInt(formData.quantity),
        unit_cost: parseFloat(formData.unit_cost)
      });
      setIsModalOpen(false);
      setFormData({ supplierId: '', productId: '', quantity: '', unit_cost: '' });
      fetchPurchases(true);
      fetchProducts(true);
      fetchStats(true);
    } catch (error) { alert('Error recording purchase'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Purchases (Stock In)</h1>
        {['Admin', 'Manager'].includes(user?.role) && (
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={20} /><span>Record Stock In</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {(!loadingPurchases || purchases.length > 0) && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-4">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Qty Added</th>
                <th className="p-4">Unit Cost</th>
                <th className="p-4">Total Cost</th>
                <th className="p-4">Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="p-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">{p.Product?.name}</td>
                  <td className="p-4">{p.Supplier?.name}</td>
                  <td className="p-4 font-bold text-green-600">+{p.quantity}</td>
                  <td className="p-4">Rs. {Number(p.unit_cost).toFixed(2)}</td>
                  <td className="p-4 font-bold">Rs. {Number(p.total_cost).toFixed(2)}</td>
                  <td className="p-4">{p.purchaser?.name}</td>
                </tr>
              ))}
              {purchases.length === 0 && <tr><td colSpan="7" className="text-center p-8">No purchase history</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Stock In">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product *</label>
            <select required className="w-full border p-2 rounded" value={formData.productId} onChange={e=>setFormData({...formData, productId: e.target.value})}>
              <option value="">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.stock})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Supplier *</label>
            <select required className="w-full border p-2 rounded" value={formData.supplierId} onChange={e=>setFormData({...formData, supplierId: e.target.value})}>
              <option value="">Select Supplier...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity Added *</label>
              <input type="number" required min="1" className="w-full border p-2 rounded" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit Cost (Rs.) *</label>
              <input type="number" step="0.01" required min="0" className="w-full border p-2 rounded" value={formData.unit_cost} onChange={e=>setFormData({...formData, unit_cost: e.target.value})} />
            </div>
          </div>
          <p className="text-right font-bold text-lg mt-4">Total: Rs. {(formData.quantity * formData.unit_cost || 0).toFixed(2)}</p>
          <div className="flex justify-end gap-2"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Submit</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Purchases;
