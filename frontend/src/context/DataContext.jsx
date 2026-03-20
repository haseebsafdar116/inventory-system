import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  const fetchProducts = useCallback(async (force = false) => {
    if (!force && products.length > 0) return;
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [products.length]);

  const fetchStats = useCallback(async (force = false) => {
    if (!force && stats) return;
    setLoadingStats(true);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [stats]);

  const fetchSuppliers = useCallback(async (force = false) => {
    if (!force && suppliers.length > 0) return;
    setLoadingSuppliers(true);
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    } finally {
      setLoadingSuppliers(false);
    }
  }, [suppliers.length]);

  const fetchCustomers = useCallback(async (force = false) => {
    if (!force && customers.length > 0) return;
    setLoadingCustomers(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setLoadingCustomers(false);
    }
  }, [customers.length]);

  const fetchPurchases = useCallback(async (force = false) => {
    if (!force && purchases.length > 0) return;
    setLoadingPurchases(true);
    try {
      const res = await api.get('/purchases');
      setPurchases(res.data);
    } catch (error) {
      console.error("Error fetching purchases", error);
    } finally {
      setLoadingPurchases(false);
    }
  }, [purchases.length]);

  // Initial pre-fetching when user is logged in
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchProducts();
      fetchSuppliers();
      fetchCustomers();
      fetchPurchases();
    } else {
      // Clear data on logout
      setProducts([]);
      setStats(null);
      setSuppliers([]);
      setCustomers([]);
      setPurchases([]);
    }
  }, [user, fetchStats, fetchProducts, fetchSuppliers, fetchCustomers, fetchPurchases]);

  const refreshAll = () => {
    fetchStats(true);
    fetchProducts(true);
    fetchSuppliers(true);
    fetchCustomers(true);
    fetchPurchases(true);
  };

  return (
    <DataContext.Provider value={{
      products, loadingProducts, fetchProducts,
      stats, loadingStats, fetchStats,
      suppliers, loadingSuppliers, fetchSuppliers,
      customers, loadingCustomers, fetchCustomers,
      purchases, loadingPurchases, fetchPurchases,
      refreshAll
    }}>
      {children}
    </DataContext.Provider>
  );
};
