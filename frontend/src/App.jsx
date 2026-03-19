import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Billing from './pages/Billing';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Users from './pages/Users';

const Placeholder = ({ name }) => <div className="p-8 text-2xl font-bold text-gray-500 text-center">{name} Page (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="billing" element={<Billing />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="low-stock" element={<Navigate to="/" replace />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
