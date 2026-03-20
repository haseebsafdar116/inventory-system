import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package, Upload } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import Modal from '../components/Modal';

const Products = () => {
  const { products, loadingProducts, fetchProducts } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', price: '', stock: '', low_stock_threshold: '10'
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || '',
        price: product.price,
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: '', stock: '', low_stock_threshold: '10' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(true);
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      const productsToBulkCreate = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        if (values.length < 4) return null;
        return {
          name: values[0],
          sku: values[1],
          price: parseFloat(values[2]),
          stock: parseInt(values[3]),
          low_stock_threshold: parseInt(values[4] || 10)
        };
      }).filter(p => p !== null && p.name);

      if (productsToBulkCreate.length === 0) {
        return alert('No valid products found in CSV. Format: name,sku,price,stock,low_stock_threshold');
      }

      try {
        await api.post('/products/bulk', { products: productsToBulkCreate });
        fetchProducts(true);
        alert(`Successfully imported ${productsToBulkCreate.length} products!`);
      } catch (err) {
        alert(err.response?.data?.message || 'Error bulk importing products');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Products</h1>
        
        {['Admin', 'Manager'].includes(user?.role) && (
          <div className="flex space-x-2">
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm cursor-pointer">
              <Upload size={20} />
              <span>Import CSV</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkImport} />
            </label>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-indigo-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="bg-transparent border-none outline-none w-full text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loadingProducts && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-4 font-semibold rounded-tl-lg">Product</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Status</th>
                  {['Admin', 'Manager'].includes(user?.role) && (
                    <th className="p-4 font-semibold rounded-tr-lg text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={product.id} 
                    className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded text-indigo-700">
                        <Package size={18} />
                      </div>
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{product.sku || 'N/A'}</td>
                    <td className="p-4 font-medium text-gray-700">Rs. {Number(product.price).toFixed(2)}</td>
                    <td className="p-4 font-bold text-gray-700">{product.stock}</td>
                    <td className="p-4">
                      {product.stock <= product.low_stock_threshold ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">Low Stock</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">In Stock</span>
                      )}
                    </td>
                    {['Admin', 'Manager'].includes(user?.role) && (
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        {user?.role === 'Admin' && (
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">Product Name *</label>
            <input 
              type="text" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">SKU</label>
              <input 
                type="text"
                value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Price (Rs.) *</label>
              <input 
                type="number" step="0.01" required
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Initial Stock *</label>
              <input 
                type="number" required disabled={!!editingProduct} // Disable changing stock directly when editing, should use Purchases/Sales
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editingProduct ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'}`}
              />
              {editingProduct && <p className="text-xs text-gray-500 mt-1">Use Purchases to add stock</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Low Stock Alert At *</label>
              <input 
                type="number" required
                value={formData.low_stock_threshold} onChange={e => setFormData({...formData, low_stock_threshold: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors shadow-md"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
