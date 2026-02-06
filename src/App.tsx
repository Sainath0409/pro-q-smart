import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import UploadPage from './pages/UploadPage';
import TablePage from './pages/TablePage';
import TreeTablePage from './pages/TreeTablePage';
import { LayoutDashboard, Table as TableIcon, GitBranch, ShieldCheck } from 'lucide-react';
import './App.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Upload CSV', icon: <LayoutDashboard size={20} /> },
    { path: '/table', label: 'BOM Table', icon: <TableIcon size={20} /> },
    { path: '/tree', label: 'Tree Table', icon: <GitBranch size={20} /> },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <ShieldCheck size={32} color="var(--primary)" />
        <span>ProQsmart</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="/tree" element={<TreeTablePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
