import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ReactDOM.createRoot(
  document.getElementById('wrapper') as HTMLElement
);
wrapper.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
