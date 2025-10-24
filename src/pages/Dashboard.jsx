import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Calendar, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const Dashboard = ({
  user
}) => {
  const [stats, setStats] = useState({
    monthlyTotal: 0,
    yearlyTotal: 0,
    purchaseCount: 0,
    topEmployee: '',
    topCategory: ''
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentSupplies, setRecentSupplies] = useState([]);
  useEffect(() => {
    calculateStats();
  }, []);
  const calculateStats = () => {
    const supplies = JSON.parse(localStorage.getItem('supplies') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlySupplies = supplies.filter(s => {
      const date = new Date(s.purchaseDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const yearlySupplies = supplies.filter(s => {
      const date = new Date(s.purchaseDate);
      return date.getFullYear() === currentYear;
    });
    const monthlyTotal = monthlySupplies.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);
    const yearlyTotal = yearlySupplies.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);
    const employeeSpending = {};
    supplies.forEach(s => {
      employeeSpending[s.employeeId] = (employeeSpending[s.employeeId] || 0) + parseFloat(s.totalPrice);
    });
    const topEmployeeId = Object.keys(employeeSpending).reduce((a, b) => employeeSpending[a] > employeeSpending[b] ? a : b, '');
    const topEmployeeData = employees.find(e => e.id === topEmployeeId);
    const topEmployee = topEmployeeData ? `${topEmployeeData.name} ${topEmployeeData.lastName}` : 'N/A';
    const categorySpending = {};
    supplies.forEach(s => {
      categorySpending[s.category] = (categorySpending[s.category] || 0) + parseFloat(s.totalPrice);
    });
    const topCategory = Object.keys(categorySpending).reduce((a, b) => categorySpending[a] > categorySpending[b] ? a : b, 'N/A');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyChartData = months.map((month, index) => {
      const monthSupplies = supplies.filter(s => {
        const date = new Date(s.purchaseDate);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });
      return {
        name: month,
        gasto: monthSupplies.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0)
      };
    });
    const categoryChartData = Object.keys(categorySpending).map(cat => ({
      name: cat,
      value: categorySpending[cat]
    }));
    const sortedSupplies = [...supplies].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    setRecentSupplies(sortedSupplies.slice(0, 5));
    setStats({
      monthlyTotal,
      yearlyTotal,
      purchaseCount: supplies.length,
      topEmployee,
      topCategory
    });
    setMonthlyData(monthlyChartData);
    setCategoryData(categoryChartData);
  };
  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    subtitle,
    delay
  }) => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: delay * 0.1
  }} whileHover={{
    y: -5,
    transition: {
      duration: 0.2
    }
  }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>;
  return <>
      <Helmet>
        <title>Dashboard - Sistema de Gestión</title>
        <meta name="description" content="Panel de control con estadísticas y métricas clave" />
      </Helmet>

      <div className="space-y-8">
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de la actividad </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatCard icon={DollarSign} title="Gasto Mensual" value={`$${stats.monthlyTotal.toLocaleString('es-AR')}`} color="bg-blue-600" subtitle="Mes actual" delay={0} />
          <StatCard icon={TrendingUp} title="Gasto Anual" value={`$${stats.yearlyTotal.toLocaleString('es-AR')}`} color="bg-blue-500" subtitle="Año en curso" delay={1} />
          <StatCard icon={ShoppingCart} title="Compras Totales" value={stats.purchaseCount} color="bg-gray-600" subtitle="Registros históricos" delay={2} />
          <StatCard icon={Users} title="Empleado Top" value={stats.topEmployee} color="bg-blue-700" subtitle="Mayor gasto" delay={3} />
          <StatCard icon={Package} title="Categoría Principal" value={stats.topCategory} color="bg-gray-700" subtitle="Más consumida" delay={4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gastos Mensuales ({new Date().getFullYear()})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={value => `$${value / 1000}k`} />
                <Tooltip cursor={{
                fill: 'rgba(59, 130, 246, 0.1)'
              }} formatter={value => [`$${value.toLocaleString('es-AR')}`, 'Gasto']} />
                <Bar dataKey="gasto" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
            <div className="space-y-3">
              {recentSupplies.map((supply, index) => <motion.div key={supply.id} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.5 + index * 0.1
            }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{supply.name}</p>
                    <p className="text-xs text-gray-500">{new Date(supply.purchaseDate).toLocaleDateString('es-ES')}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">${parseFloat(supply.totalPrice).toLocaleString('es-AR')}</p>
                </motion.div>)}
              {recentSupplies.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No hay compras recientes.</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </>;
};
export default Dashboard;