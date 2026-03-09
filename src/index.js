import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // We'll create this later with Tailwind imports
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);