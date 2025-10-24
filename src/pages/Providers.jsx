
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const Providers = ({ user }) => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    cuit: '',
    phone: '',
    email: '',
    address: '',
    category: ''
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    const stored = localStorage.getItem('providers');
    if (stored) {
      setProviders(JSON.parse(stored));
    }
  };

  const saveProviders = (data) => {
    localStorage.setItem('providers', JSON.stringify(data));
    setProviders(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProvider) {
      const updated = providers.map(prov => 
        prov.id === editingProvider.id ? { ...formData, id: prov.id } : prov
      );
      saveProviders(updated);
      toast({
        title: "Proveedor actualizado",
        description: "Los datos se guardaron correctamente",
      });
    } else {
      const newProvider = {
        ...formData,
        id: Date.now().toString()
      };
      saveProviders([...providers, newProvider]);
      toast({
        title: "Proveedor creado",
        description: "El proveedor se agregó exitosamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData(provider);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = providers.filter(prov => prov.id !== id);
    saveProviders(updated);
    toast({
      title: "Proveedor eliminado",
      description: "El registro se eliminó correctamente",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cuit: '',
      phone: '',
      email: '',
      address: '',
      category: ''
    });
    setEditingProvider(null);
  };

  const filteredProviders = providers.filter(prov =>
    prov.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prov.cuit.includes(searchTerm)
  );

  return (
    <>
      <Helmet>
        <title>Proveedores - Sistema de Gestión</title>
        <meta name="description" content="Gestión de proveedores" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
            <p className="text-gray-600 mt-1">Gestiona los proveedores de la empresa</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nombre o Razón Social *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuit">CUIT *</Label>
                    <Input
                      id="cuit"
                      value={formData.cuit}
                      onChange={(e) => setFormData({...formData, cuit: e.target.value})}
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
                    <Label htmlFor="category">Rubro *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="Ej: Papelería, Limpieza, etc."
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
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingProvider ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar por nombre o CUIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CUIT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rubro</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Teléfono</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">{provider.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{provider.cuit}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{provider.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{provider.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{provider.email}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(provider)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredProviders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron proveedores
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Providers;
