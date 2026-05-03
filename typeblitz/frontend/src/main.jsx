/**
 * main.jsx — Ponto de entrada do React
 *
 * Monta o componente raiz <App /> no elemento #root do index.html.
 * O StrictMode ativa verificações extras em desenvolvimento
 * (sem impacto em produção).
 */

import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
