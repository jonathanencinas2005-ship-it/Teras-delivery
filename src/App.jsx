import React, { useState } from 'react';
import { useApp } from './AppContext.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewOrder from './pages/NewOrder.jsx';
import History from './pages/History.jsx';
import ReceiptPage from './pages/ReceiptPage.jsx';
import ReceiptList from './pages/ReceiptList.jsx';
import CustomReceipt from './pages/CustomReceipt.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  const { driverName } = useApp();
  const [page, setPage] = useState('dashboard');
  const [params, setParams] = useState({});

  function navigate(nextPage, nextParams = {}) {
    setPage(nextPage);
    setParams(nextParams);
  }

  if (!driverName) {
    return <Onboarding onDone={() => navigate('dashboard')} />;
  }

  let content = null;
  switch (page) {
    case 'dashboard':
      content = <Dashboard navigate={navigate} />;
      break;
    case 'new-order':
      content = <NewOrder navigate={navigate} editId={params.editId} />;
      break;
    case 'history':
      content = <History navigate={navigate} />;
      break;
    case 'receipt-list':
      content = <ReceiptList navigate={navigate} />;
      break;
    case 'receipt':
      content = <ReceiptPage navigate={navigate} txId={params.txId} />;
      break;
    case 'custom-receipt':
      content = <CustomReceipt navigate={navigate} />;
      break;
    case 'reports':
      content = <Reports navigate={navigate} />;
      break;
    case 'settings':
      content = <Settings navigate={navigate} />;
      break;
    default:
      content = <Dashboard navigate={navigate} />;
  }

  const navPages = ['dashboard', 'history', 'receipt-list', 'reports', 'settings'];

  return (
    <div className="app-shell">
      {content}
      {navPages.includes(page) && <BottomNav current={page} navigate={navigate} />}
    </div>
  );
}
