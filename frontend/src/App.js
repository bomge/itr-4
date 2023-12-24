import { Routes, Route, Navigate } from 'react-router-dom';
import LoginV2 from './components/auth/LoginV2';
import DashboardLayout from './components/dashboard/DashboardLayout';
import PersistLogin from './components/auth/PersistLogin';
import Table from './components/dashboard/Table';

import './App.module.css';
import Register from './components/auth/Register';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<LoginV2 />} />
      <Route path="register" element={<Register />} />
      {/* Private routes */}
      <Route element={<PersistLogin />}>
        <Route path="dash" element={<DashboardLayout />}>
          <Route index element={<Table />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
