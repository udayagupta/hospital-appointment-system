import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const PopUpModal = ({ isOpen, onClose, title, children }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
\          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-grey-500 bg-opacity-60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700"
          >
            
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-700">
              <h3 className="text-xl font-bold text-slate-100">{title}</h3>
              
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-500/10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-5">
              {children}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PopUpModal;