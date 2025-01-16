'use client';
import React, { useState } from 'react';
import axios, { AxiosError }  from 'axios';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import crypto from 'crypto';

const AuthForm: React.FC = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const hashPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hashedPassword = hashPassword(formState.password); 
  
      const response = await axios.post('/api/login', {
        email: formState.email,
        password: hashedPassword, 
      });
  
      localStorage.setItem('token', response.data.token);
      alert('Вы успешно вошли в систему!');
      setFormState({ email: '', password: '' });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Ошибка авторизации');
      } else {
        setError('Ошибка авторизации');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 m-auto">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          required
          className="p-3 w-full text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            required
            className="p-3 w-full text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-[#6E4C1EFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#98730C]"
      >
        Войти
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default AuthForm;



