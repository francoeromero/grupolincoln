
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [supplies, setSupplies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth()).toString());
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredMonthlySupplies, setFilteredMonthlySupplies] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState({ totalSpent: 0, totalItems: 0 });

  const { toast } = useToast();

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (supplies.length > 0) {
      generateChartData(supplies, employees);
      generateMonthlyReport(supplies);
    }
  }, [selectedYear, selectedMonth, supplies, employees]);

  const loadData = () => {
    const storedSupplies = JSON.parse(localStorage.getItem('supplies') || '[]');
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    setSupplies(storedSupplies);
    setEmployees(storedEmployees);
  };
  
  const generateMonthlyReport = (suppliesData) => {
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);

    const filtered = suppliesData.filter(s => {
        const date = new Date(s.purchaseDate);
        return date.getFullYear() === year && date.getMonth() === month;
    }).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    
    const totalSpent = filtered.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);
    const totalItems = filtered.reduce((sum, s) => sum + parseInt(s.quantity, 10), 0);

    setFilteredMonthlySupplies(filtered);
    setMonthlyReport({ totalSpent, totalItems });
  };

  const generateChartData = (suppliesData, employeesData) => {
    const year = parseInt(selectedYear);
    const yearSupplies = suppliesData.filter(s => new Date(s.purchaseDate).getFullYear() === year);

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyChartData = monthNames.map((month, index) => ({
      name: month,
      gasto: yearSupplies
        .filter(s => new Date(s.purchaseDate).getMonth() === index)
        .reduce((sum, s) => sum + parseFloat(s.totalPrice), 0)
    }));

    const categorySpending = yearSupplies.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + parseFloat(s.totalPrice);
      return acc;
    }, {});
    const categoryChartData = Object.keys(categorySpending).map(cat => ({
      name: cat,
      value: categorySpending[cat]
    }));

    const employeeSpending = yearSupplies.reduce((acc, s) => {
      acc[s.employeeId] = (acc[s.employeeId] || 0) + parseFloat(s.totalPrice);
      return acc;
    }, {});
    const employeeChartData = Object.keys(employeeSpending).map(empId => {
      const emp = employeesData.find(e => e.id === empId);
      return {
        name: emp ? `${emp.name} ${emp.lastName}` : 'N/A',
        gasto: employeeSpending[empId]
      };
    }).sort((a, b) => b.gasto - a.gasto).slice(0, 10);

    setMonthlyData(monthlyChartData);
    setCategoryData(categoryChartData);
    setEmployeeData(employeeChartData);
  };

  const exportToPDF = (isMonthly) => {
    const doc = new jsPDF();
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);
    const monthName = months[month];
    
    const title = isMonthly ? `Reporte de Gastos - ${monthName} ${year}` : `Reporte Anual de Gastos - ${year}`;
    const filename = isMonthly ? `reporte-mensual-${month + 1}-${year}.pdf` : `reporte-anual-${year}.pdf`;

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    const dataToExport = isMonthly ? filteredMonthlySupplies : supplies.filter(s => new Date(s.purchaseDate).getFullYear() === year);

    const tableData = dataToExport.map(s => {
        const emp = employees.find(e => e.id === s.employeeId);
        return [
          s.name, s.category, s.quantity,
          `$${parseFloat(s.totalPrice).toFixed(2)}`,
          emp ? `${emp.name} ${emp.lastName}` : 'N/A',
          formatDate(s.purchaseDate)
        ];
      });

    doc.autoTable({
      head: [['Insumo', 'Categoría', 'Cantidad', 'Total', 'Empleado', 'Fecha']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 }
    });

    doc.save(filename);
    toast({ title: "PDF Generado", description: "El reporte se descargó correctamente" });
  };

  const exportToCSV = (isMonthly) => {
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);
    const monthName = months[month];
    
    const filename = isMonthly ? `reporte-mensual-${month + 1}-${year}.csv` : `reporte-anual-${year}.csv`;
    const dataToExport = isMonthly ? filteredMonthlySupplies : supplies.filter(s => new Date(s.purchaseDate).getFullYear() === year);

    const headers = ['Insumo', 'Categoría', 'Cantidad', 'Precio Unitario', 'Precio Total', 'ID Proveedor', 'ID Empleado', 'Fecha'];
    const rows = dataToExport.map(s => [s.name, s.category, s.quantity, s.unitPrice, s.totalPrice, s.providerId, s.employeeId, s.purchaseDate]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast({ title: "CSV Generado", description: "El reporte se descargó correctamente" });
  };

  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const timeZoneOffset = date.getTimezoneOffset();
    const correctedDate = new Date(date.getTime() + timeZoneOffset * 60000);
    return correctedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Reportes - Sistema de Gestión</title>
        <meta name="description" content="Reportes y estadísticas de gastos" />
      </Helmet>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600 mt-1">Análisis de gastos por año</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={() => exportToPDF(false)} variant="outline"><FileText className="h-4 w-4 mr-2" />PDF</Button>
            <Button onClick={() => exportToCSV(false)} variant="outline"><FileSpreadsheet className="h-4 w-4 mr-2" />CSV</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gastos Mensuales {selectedYear}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="gasto" stroke="#1e40af" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm border lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Empleados por Gasto</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={employeeData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={150} /><Tooltip /><Bar dataKey="gasto" fill="#1e40af" radius={[0, 8, 8, 0]} /></BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Detalle de Gastos Mensuales</h2>
                        <p className="text-gray-600 mt-1">Insumos comprados en el mes seleccionado.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>{months.map((m, i) => <SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Button onClick={() => exportToPDF(true)} variant="outline"><FileText className="h-4 w-4 mr-2" />PDF</Button>
                        <Button onClick={() => exportToCSV(true)} variant="outline"><FileSpreadsheet className="h-4 w-4 mr-2" />CSV</Button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold">GASTO TOTAL</p>
                        <p className="text-2xl font-bold text-blue-900">${monthlyReport.totalSpent.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 font-semibold">ITEMS COMPRADOS</p>
                        <p className="text-2xl font-bold text-gray-800">{monthlyReport.totalItems}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Insumo</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMonthlySupplies.length > 0 ? filteredMonthlySupplies.map(s => (
                                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{s.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(s.purchaseDate)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{s.quantity}</td>
                                    <td className="py-3 px-4 font-semibold">${parseFloat(s.totalPrice).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-gray-500">No hay gastos para este mes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>

      </div>
    </>
  );
};

export default Reports;
