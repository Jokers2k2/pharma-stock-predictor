import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-[var(--sidebar-width)] transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
