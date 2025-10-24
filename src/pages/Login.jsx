
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
      const defaultAdmin = {
        id: '1',
        email: 'admin@empresa.com',
        password: 'lincoln2025',
        name: 'Administrador',
        role: 'admin'
      };
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      toast({
        title: "¡Bienvenido!",
        description: `Inicio de sesión exitoso como ${user.name}`,
      });
      onLogin(user);
    } else {
      toast({
        title: "Error de autenticación",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Sistema de Gestión</title>
        <meta name="description" content="Accede al sistema de gestión empresarial" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="flex justify-center mb-8">
              <img 
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhIv4DBp0pRcdsjviC5BvPyR5K8FapKwOGRPrLbx7Fd1DPy6h4tdNKNoWxhfjCfUhx3KzreHj7JmnBFJ004JE3OvSLLoH5OiWwDU8SCCJC3JnZ7qooLi2qY0wbni3e2QXyX4HvdKPNcC6o3kT9PX9ARO57JTUOEkxFppMIdob7RokTBc4NaEb5C1A5xrtbG"
                alt="Logo de la empresa"
                className="h-32 object-contain"
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
              <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Contraseña por defecto: <span className="font-mono font-semibold text-blue-600">lincoln2025</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Email de prueba: admin@empresa.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
