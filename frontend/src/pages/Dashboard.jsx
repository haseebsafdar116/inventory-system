import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { stats, loadingStats } = React.useContext(DataContext);

  if (loadingStats && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Formatting for chart
  const salesData = [
    { name: 'Week 1', sales: Math.floor(stats?.monthlySales * 0.2) || 1200 },
    { name: 'Week 2', sales: Math.floor(stats?.monthlySales * 0.3) || 1800 },
    { name: 'Week 3', sales: Math.floor(stats?.monthlySales * 0.15) || 900 },
    { name: 'Week 4', sales: Math.floor(stats?.monthlySales * 0.35) || 2100 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Store Overview</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={<Package size={24} />} 
          color="border-blue-500" 
          delay={0.1} 
        />
        <StatCard 
          title="Monthly Sales (Rs.)" 
          value={`Rs. ${Number(stats?.monthlySales || 0).toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          color="border-green-500" 
          delay={0.2} 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats?.lowStockAlerts || 0} 
          icon={<AlertTriangle size={24} />} 
          color="border-red-500" 
          delay={0.3} 
        />
        <StatCard 
          title="Recent Orders" 
          value={stats?.recentSales?.length || 0} 
          icon={<TrendingUp size={24} />} 
          color="border-purple-500" 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend (This Month)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Rs. ${value}`} />
                <Tooltip 
                  cursor={{ fill: '#FEF3C7' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="sales" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Items List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Items Needing Restock</h2>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {stats?.lowStockAlerts || 0} items
            </span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
            {stats?.lowStockProducts?.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded text-red-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 truncate w-32">{product.name}</h4>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{product.stock} left</p>
                  <p className="text-xs text-gray-500">Min: {product.low_stock_threshold}</p>
                </div>
              </div>
            ))}
            {(!stats?.lowStockAlerts || stats?.lowStockAlerts === 0) && (
              <div className="text-center text-gray-500 py-8">
                <Package size={48} className="mx-auto text-gray-300 mb-2" />
                <p>All stock levels are optimal.</p>
              </div>
            )}
            {stats?.lowStockAlerts > 5 && (
              <p className="text-center text-sm text-blue-600 font-medium pt-2 cursor-pointer hover:underline">
                View all {stats.lowStockAlerts} low stock items &rarr;
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
