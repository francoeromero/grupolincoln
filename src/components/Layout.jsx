
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Truck, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Layout = ({ children, user, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/empleados', icon: Users, label: 'Empleados' },
    { path: '/insumos', icon: Package, label: 'Insumos' },
    { path: '/proveedores', icon: Truck, label: 'Proveedores' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Grupo Lincoln</h3>
          <img 
            src="https://blogger.googleusercontent.com/img/a/AVvXsEhIv4DBp0pRcdsjviC5BvPyR5K8FapKwOGRPrLbx7Fd1DPy6h4tdNKNoWxhfjCfUhx3KzreHj7JmnBFJ004JE3OvSLLoH5OiWwDU8SCCJC3JnZ7qooLi2qY0wbni3e2QXyX4HvdKPNcC6o3kT9PX9ARO57JTUOEkxFppMIdob7RokTBc4NaEb5C1A5xrtbG"
            alt="Logo"
            className="h-16 mx-auto"
          />
        </Link>
      </div>
      <nav className="p-4 space-y-2 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/configuracion"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            location.pathname.startsWith('/configuracion')
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop - Fixed */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar for Mobile - Toggleable */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40"
            >
              <SidebarContent />
            </motion.aside>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-20">
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Configuración' || 'Dashboard'}
              </h1>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user?.name?.[0]}
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/configuracion">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
