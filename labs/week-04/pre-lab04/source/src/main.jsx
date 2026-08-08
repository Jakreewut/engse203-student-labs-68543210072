import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; //component
import './styles.css'; 

//ตัวเชื่อมระหว่าง fornt กับ back
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

