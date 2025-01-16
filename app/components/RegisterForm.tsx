'use client';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import crypto from 'crypto';

const RegisterForm: React.FC = () => {
  const [formState, setFormState] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

    const hashPassword = (password: string) => {
      return crypto.createHash('sha256').update(password).digest('hex');
    };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const hashedPassword = hashPassword(formState.password); 
    const confirmPassword = hashPassword(formState.confirmPassword); 

    const response = await axios.post('/api/register', {
      email: formState.email,
      password: hashedPassword,
      confirmPassword: confirmPassword
    });

    localStorage.setItem('token', response.data.token);
    alert('Вы успешно зарегистрированы!');
    setFormState({ email: '', password: '', confirmPassword: '' });
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } else {
      setError('Ошибка регистрации');
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
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Пароль
        </label>
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
      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formState.confirmPassword}
          onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
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
      <button
        type="submit"
        className="w-full rounded-md bg-[#6E4C1EFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#98730C]"
      >
        Зарегистрироваться
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default RegisterForm;
