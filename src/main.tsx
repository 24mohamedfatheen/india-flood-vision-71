
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply saved theme if available
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(savedTheme);

// Apply saved language if available
const savedLanguage = localStorage.getItem('language') || 'english';
document.documentElement.setAttribute('lang', savedLanguage);

// Set html attribute for language direction (for RTL languages like Urdu)
if (savedLanguage === 'urdu') {
  document.documentElement.setAttribute('dir', 'rtl');
} else {
  document.documentElement.setAttribute('dir', 'ltr');
}

// Create root with StrictMode to ensure proper React context
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
