import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Bell, AlertTriangle, Send } from 'lucide-react';

const Layout = () => {
  const { user, loading } = useContext(AuthContext);
  const [isUrdu] = React.useState(() => document.cookie.includes('googtrans=/en/ur'));
  const [lowStockItems, setLowStockItems] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const fetchLowStock = () => {
    if (user) {
      api.get('/products').then(res => {
        const lows = res.data.filter(p => p.stock <= p.low_stock_threshold);
        setLowStockItems(lows);
      }).catch(err => console.error(err));
    }
  };

  React.useEffect(() => {
    fetchLowStock();
    window.addEventListener('stockUpdated', fetchLowStock);
    return () => window.removeEventListener('stockUpdated', fetchLowStock);
  }, [user]);

  const sendSmsAlerts = async () => {
    try {
      const res = await api.post('/products/low-stock-alert', { items: lowStockItems });
      alert(res.data.message || 'SMS Alert Processed!');
      setShowNotifications(false);
    } catch(err) {
      alert('Error initiating SMS alerts');
    }
  };

  const toggleLanguage = () => {
    if (isUrdu) {
      document.cookie = 'googtrans=/en/en; path=/';
    } else {
      document.cookie = 'googtrans=/en/ur; path=/';
    }
    window.location.reload();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10 sticky top-0">
          <h2 className="text-xl font-semibold text-slate-800">Hafiz Tahir Traders</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors relative"
              >
                <Bell size={20} />
                {lowStockItems.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                    {lowStockItems.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> Notifications</h3>
                    <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded-full">{lowStockItems.length} New</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {lowStockItems.length === 0 ? (
                      <p className="p-4 text-sm text-slate-500 text-center">No alerts at the moment.</p>
                    ) : (
                      lowStockItems.map(item => (
                        <div key={item.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-red-500 font-medium">Stock is running low: {item.stock} left!</p>
                        </div>
                      ))
                    )}
                  </div>
                  {lowStockItems.length > 0 && ['Admin', 'Manager'].includes(user?.role) && (
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                      <button onClick={sendSmsAlerts} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors">
                        <Send size={16} /> Send Twilio SMS Alert
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={toggleLanguage}
              className="px-4 py-1.5 rounded-full border-2 border-indigo-200 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              {isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold border border-indigo-300">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
