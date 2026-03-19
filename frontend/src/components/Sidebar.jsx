import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Package, Users, ShoppingCart, Truck, FileText, AlertTriangle, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} />, roles: ['Admin', 'Manager', 'Cashier'] },
    { name: 'Products', path: '/products', icon: <Package size={20} />, roles: ['Admin', 'Manager', 'Cashier'] },
    { name: 'Sales & Billing', path: '/billing', icon: <ShoppingCart size={20} />, roles: ['Admin', 'Manager', 'Cashier'] },
    { name: 'Purchases (Stock In)', path: '/purchases', icon: <Truck size={20} />, roles: ['Admin', 'Manager'] },
    { name: 'Suppliers', path: '/suppliers', icon: <Users size={20} />, roles: ['Admin', 'Manager'] },
    { name: 'Customers', path: '/customers', icon: <Users size={20} />, roles: ['Admin', 'Manager', 'Cashier'] },
    { name: 'Low Stock', path: '/low-stock', icon: <AlertTriangle size={20} />, roles: ['Admin', 'Manager'] },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} />, roles: ['Admin', 'Manager'] },
    { name: 'System Users', path: '/users', icon: <Shield size={20} />, roles: ['Admin'] },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col min-h-screen shadow-xl">
      <div className="p-6 text-center border-b border-slate-800">
        <h1 className="text-lg font-bold tracking-wider">Hafiz Tahir Traders</h1>
        <p className="text-xs text-slate-400 mt-1">Inventory Management</p>
      </div>
      
      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (!item.roles.includes(user?.role)) return null;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-indigo-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-2">
          <p className="text-sm text-slate-400">Logged in as:</p>
          <p className="font-semibold">{user?.name} ({user?.role})</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
