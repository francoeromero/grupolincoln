
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Supplies = ({ user }) => {
  const [supplies, setSupplies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const { toast } = useToast();

  const getTodayDateString = () => {
    const today = new Date();
    // Fix for timezone offset
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unitPrice: '',
    totalPrice: '',
    providerId: '',
    purchaseDate: getTodayDateString(),
    employeeId: '',
    receipt: ''
  });

  const categories = ['Papelería', 'Limpieza', 'Impresión', 'Herramientas', 'Tecnología', 'Mobiliario', 'Otros'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.quantity && formData.unitPrice) {
      const total = parseFloat(formData.quantity) * parseFloat(formData.unitPrice);
      setFormData(prev => ({ ...prev, totalPrice: total.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, totalPrice: '' }));
    }
  }, [formData.quantity, formData.unitPrice]);

  const loadData = () => {
    const storedSupplies = localStorage.getItem('supplies');
    const storedEmployees = localStorage.getItem('employees');
    const storedProviders = localStorage.getItem('providers');
    
    if (storedSupplies) setSupplies(JSON.parse(storedSupplies));
    if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
    if (storedProviders) setProviders(JSON.parse(storedProviders));
  };

  const saveSupplies = (data) => {
    localStorage.setItem('supplies', JSON.stringify(data));
    setSupplies(data);
  };
  
  const handleOpenNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSupply) {
      const updated = supplies.map(sup => 
        sup.id === editingSupply.id ? { ...formData, id: sup.id } : sup
      );
      saveSupplies(updated);
      toast({
        title: "Insumo actualizado",
        description: "Los datos se guardaron correctamente",
      });
    } else {
      const newSupply = {
        ...formData,
        id: Date.now().toString()
      };
      saveSupplies([...supplies, newSupply]);
      toast({
        title: "Insumo registrado",
        description: "El insumo se agregó exitosamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (supply) => {
    setEditingSupply(supply);
    setFormData(supply);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
      const updated = supplies.filter(sup => sup.id !== id);
      saveSupplies(updated);
      toast({
        title: "Insumo eliminado",
        description: "El registro se eliminó correctamente",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingSupply(null);
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
      providerId: '',
      purchaseDate: getTodayDateString(),
      employeeId: '',
      receipt: ''
    });
  };

  const filteredSupplies = supplies.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || sup.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));


  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.name} ${emp.lastName}` : 'N/A';
  };

  const getProviderName = (id) => {
    const prov = providers.find(p => p.id === id);
    return prov ? prov.name : 'N/A';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const timeZoneOffset = date.getTimezoneOffset();
    const correctedDate = new Date(date.getTime() + timeZoneOffset * 60000);
    return correctedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Insumos - Sistema de Gestión</title>
        <meta name="description" content="Gestión de insumos y compras" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insumos</h1>
            <p className="text-gray-600 mt-1">Registra y gestiona las compras</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenNewDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Insumo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSupply ? 'Editar Insumo' : 'Nuevo Insumo'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nombre del Insumo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select required value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Precio Unitario *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPrice">Precio Total</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="0.01"
                      value={formData.totalPrice}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="providerId">Proveedor *</Label>
                    <Select required value={formData.providerId} onValueChange={(value) => setFormData({...formData, providerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map(prov => (
                          <SelectItem key={prov.id} value={prov.id}>{prov.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Empleado que Compró *</Label>
                    <Select required value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} {emp.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">Fecha de Compra *</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="receipt">Comprobante (URL)</Label>
                    <Input
                      id="receipt"
                      value={formData.receipt}
                      onChange={(e) => setFormData({...formData, receipt: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingSupply ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar insumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Insumo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoría</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Precio Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empleado</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplies.map((supply) => (
                  <motion.tr
                    key={supply.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{supply.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{supply.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(supply.purchaseDate)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{supply.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                      ${parseFloat(supply.totalPrice).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{getEmployeeName(supply.employeeId)}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex justify-end gap-1">
                        {supply.receipt && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                           <a href={supply.receipt} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 text-gray-600" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(supply)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(supply.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredSupplies.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No se encontraron insumos</p>
                <p className="text-sm">Prueba a cambiar los filtros de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Supplies;
