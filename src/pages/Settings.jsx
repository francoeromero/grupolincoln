
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Settings = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
      toast({
        title: "Error",
        description: "Contraseña actual incorrecta",
        variant: "destructive",
      });
      return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    const authData = JSON.parse(localStorage.getItem('authData'));
    authData.user.password = newPassword;
    localStorage.setItem('authData', JSON.stringify(authData));

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña se cambió exitosamente",
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <Helmet>
        <title>Configuración - Sistema de Gestión</title>
        <meta name="description" content="Configuración de cuenta y preferencias" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Administra tu cuenta y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Información de Usuario</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Actualizar Contraseña
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Settings;
