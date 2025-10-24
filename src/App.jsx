
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Employees from '@/pages/Employees';
import Supplies from '@/pages/Supplies';
import Providers from '@/pages/Providers';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Layout from '@/components/Layout';

const seedData = () => {
  if (!localStorage.getItem('data_seeded')) {
    const defaultEmployees = [
      { id: '1', name: 'Juan', lastName: 'Pérez', dni: '12345678', birthDate: '1990-05-15', address: 'Calle Falsa 123', phone: '1122334455', email: 'juan.perez@empresa.com', position: 'Vendedor Senior', hireDate: '2020-01-10', salary: '120000', department: 'Ventas' },
      { id: '2', name: 'Ana', lastName: 'Gómez', dni: '87654321', birthDate: '1992-08-22', address: 'Avenida Siempreviva 742', phone: '1166778899', email: 'ana.gomez@empresa.com', position: 'Administrativa', hireDate: '2021-03-20', salary: '95000', department: 'Administración' },
      { id: '3', name: 'Carlos', lastName: 'Ruiz', dni: '11223344', birthDate: '1988-11-30', address: 'Boulevard de los Sueños Rotos 45', phone: '1133445566', email: 'carlos.ruiz@empresa.com', position: 'Soporte Técnico', hireDate: '2019-07-01', salary: '110000', department: 'TI' },
      { id: '4', name: 'María', lastName: 'Rodriguez', dni: '44332211', birthDate: '1995-02-18', address: 'Pasaje del Sol 8', phone: '1177889900', email: 'maria.rodriguez@empresa.com', position: 'Vendedora Jr.', hireDate: '2023-09-01', salary: '85000', department: 'Ventas' }
    ];

    const defaultProviders = [
      { id: '101', name: 'Librería El Estudiante', cuit: '30-11223344-5', phone: '011-4567-8901', email: 'ventas@libreriaestudiante.com', address: 'Rivadavia 5000', category: 'Papelería' },
      { id: '102', name: 'Limpieza Total S.A.', cuit: '30-55667788-9', phone: '011-4321-9876', email: 'contacto@limpiezatotal.com', address: 'Corrientes 3000', category: 'Limpieza' },
      { id: '103', name: 'Tecno Soluciones', cuit: '30-99887766-5', phone: '011-4888-5555', email: 'info@tecnosoluciones.com', address: 'Florida 500', category: 'Tecnología' }
    ];

    const defaultSupplies = [
      { id: '1001', name: 'Resma de Papel A4', category: 'Papelería', quantity: '10', unitPrice: '8.50', totalPrice: '85.00', providerId: '101', purchaseDate: '2025-10-15', employeeId: '2', receipt: '' },
      { id: '1002', name: 'Mouse Inalámbrico', category: 'Tecnología', quantity: '2', unitPrice: '25.00', totalPrice: '50.00', providerId: '103', purchaseDate: '2025-10-10', employeeId: '3', receipt: '' },
      { id: '1003', name: 'Detergente Limpiador', category: 'Limpieza', quantity: '5', unitPrice: '5.00', totalPrice: '25.00', providerId: '102', purchaseDate: '2025-09-28', employeeId: '2', receipt: '' },
      { id: '1004', name: 'Toner para Impresora', category: 'Impresión', quantity: '1', unitPrice: '120.00', totalPrice: '120.00', providerId: '103', purchaseDate: '2025-09-15', employeeId: '3', receipt: '' },
      { id: '1005', name: 'Caja de Bolígrafos', category: 'Papelería', quantity: '3', unitPrice: '12.00', totalPrice: '36.00', providerId: '101', purchaseDate: '2025-08-20', employeeId: '1', receipt: '' },
      { id: '1006', name: 'Teclado Mecánico', category: 'Tecnología', quantity: '1', unitPrice: '80.00', totalPrice: '80.00', providerId: '103', purchaseDate: '2025-08-05', employeeId: '4', receipt: '' },
      { id: '1007', name: 'Lavandina', category: 'Limpieza', quantity: '10', unitPrice: '2.50', totalPrice: '25.00', providerId: '102', purchaseDate: '2025-07-30', employeeId: '2', receipt: '' }
    ];

    localStorage.setItem('employees', JSON.stringify(defaultEmployees));
    localStorage.setItem('providers', JSON.stringify(defaultProviders));
    localStorage.setItem('supplies', JSON.stringify(defaultSupplies));
    localStorage.setItem('data_seeded', 'true');
  }
};

seedData();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      setIsAuthenticated(true);
      setCurrentUser(parsed.user);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('authData', JSON.stringify({ user }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('authData');
  };

  return (
    <>
      <Helmet>
        <title>Sistema de Gestión Empresarial</title>
        <meta name="description" content="Sistema profesional de gestión de insumos, empleados y proveedores" />
      </Helmet>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout user={currentUser} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                  <Route path="/empleados" element={<Employees user={currentUser} />} />
                  <Route path="/insumos" element={<Supplies user={currentUser} />} />
                  <Route path="/proveedores" element={<Providers user={currentUser} />} />
                  <Route path="/reportes" element={<Reports user={currentUser} />} />
                  <Route path="/configuracion" element={<Settings user={currentUser} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
