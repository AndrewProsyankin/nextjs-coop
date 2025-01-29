'use client';
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AuthForm from "../Forms/AuthForm";
import RegisterForm from "../Forms/RegisterForm"; 

const AuthModal: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);  

  const handleClose = () => {
    setOpen(false);
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);  
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <motion.div
                  className="pointer-events-auto w-screen max-w-md"
                  initial={{ opacity: 0, y: -100, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -100, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md h-full">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-medium text-gray-900">
                            {isRegistering ? "Регистрация" : "Авторизация"}  
                          </DialogTitle>
                          <button
                            type="button"
                            onClick={handleClose}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="mt-8">
                          {isRegistering ? (
                            <RegisterForm />  
                          ) : (
                            <AuthForm />
                          )}
                        </div>
                      </div>
                      <div className="px-6 py-4 text-center">
                        <p className="font-medium text-gray-600">
                          <strong>{isRegistering ? "Уже есть аккаунт?" : "Нет аккаунта?"}</strong>
                          <button
                            onClick={toggleForm}
                            className="text-blue-600 hover:text-blue-700 ml-1"
                          >
                            {isRegistering ? "Войти" : "Зарегистрироваться"}
                          </button>
                        </p>
                      </div>
                    </div>
                  </DialogPanel>
                </motion.div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
