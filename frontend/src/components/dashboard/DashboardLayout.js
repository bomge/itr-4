import { Outlet } from 'react-router-dom';
import DashboardLayoutHeader from './DashboardLayoutHeader';

export default function DashboardLayout() {
  return (
    <>
        <DashboardLayoutHeader />
        <Outlet />
    </>
  );
}
