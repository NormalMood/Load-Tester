import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const wrapper = ReactDOM.createRoot(
  document.getElementById('wrapper') as HTMLElement
);
wrapper.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
