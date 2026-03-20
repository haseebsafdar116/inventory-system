import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, ShoppingCart, CreditCard, User, Printer, Package } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

const Billing = () => {
  const { products, customers, fetchProducts, fetchStats } = useContext(DataContext);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Remove local fetchData and useEffect

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Cannot add more than available stock!");
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const product = products.find(p => p.id === id);
    if (newQuantity > product.stock) {
      alert("Cannot exceed available stock!");
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    
    setLoading(true);
    try {
      const saleData = {
        customerId: selectedCustomer || null,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      };

      const res = await api.post('/sales', saleData);
      
      // Print Invoice Logic could go here (e.g., window.print())
      alert('Sale completed successfully!');
      
      // Reset POS
      setCart([]);
      setSelectedCustomer('');
      setPaymentMethod('Cash');
      
      // Refresh context data
      fetchProducts(true);
      fetchStats(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing sale');
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Product Selection Area */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-indigo-600" /> Products
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between h-36"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm group-hover:text-indigo-700">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-gray-900">Rs. {Number(product.price).toFixed(2)}</span>
                  <button className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No products found in stock.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart & Checkout Area */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden border border-gray-100">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart /> Current Order
          </h2>
          <span className="bg-indigo-900 px-3 py-1 rounded-full text-sm font-semibold">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {cart.map((item, index) => (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={`${item.id}-${index}`}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm truncate pr-2">{item.name}</h4>
                <span className="font-bold text-gray-700 text-sm">Rs. {Number(item.price).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                  <span className="px-3 py-1 text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="space-y-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User size={16} /> Customer (Optional)
              </label>
              <select 
                value={selectedCustomer} 
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <CreditCard size={16} /> Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card', 'Online'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-sm rounded-lg border font-medium transition-colors ${
                      paymentMethod === method 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <div className="flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total:</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200"
              title="Print Last Invoice"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition-colors flex justify-center items-center ${
                cart.length === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-slate-800 shadow-lg'
              }`}
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
