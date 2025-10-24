
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Employees = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    dni: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    position: '',
    hireDate: '',
    salary: '',
    department: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      setEmployees(JSON.parse(stored));
    }
  };

  const saveEmployees = (data) => {
    localStorage.setItem('employees', JSON.stringify(data));
    setEmployees(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEmployee) {
      const updated = employees.map(emp => 
        emp.id === editingEmployee.id ? { ...formData, id: emp.id } : emp
      );
      saveEmployees(updated);
      toast({
        title: "Empleado actualizado",
        description: "Los datos se guardaron correctamente",
      });
    } else {
      const newEmployee = {
        ...formData,
        id: Date.now().toString()
      };
      saveEmployees([...employees, newEmployee]);
      toast({
        title: "Empleado creado",
        description: "El empleado se agregó exitosamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = employees.filter(emp => emp.id !== id);
    saveEmployees(updated);
    toast({
      title: "Empleado eliminado",
      description: "El registro se eliminó correctamente",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastName: '',
      dni: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      position: '',
      hireDate: '',
      salary: '',
      department: ''
    });
    setEditingEmployee(null);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.dni.includes(searchTerm);
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <>
      <Helmet>
        <title>Empleados - Sistema de Gestión</title>
        <meta name="description" content="Gestión de empleados de la empresa" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
            <p className="text-gray-600 mt-1">Gestiona el personal de la empresa</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI *</Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Cargo *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hireDate">Fecha de Ingreso *</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Sueldo (opcional)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingEmployee ? 'Actualizar' : 'Crear'}
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
                placeholder="Buscar por nombre, apellido o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DNI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cargo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Departamento</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {employee.name} {employee.lastName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.dni}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.position}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron empleados
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Employees;
