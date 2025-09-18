import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
); 



















// import { StrictMode } from 'react'
 // import { createRoot } from 'react-dom/client'
 // import './index.css'
 // import App from './App.jsx'
 // 
 // createRoot(document.getElementById('root')).render(
 // //  <StrictMode>
 //     <App />
 // //  </StrictMode>,
 // )
