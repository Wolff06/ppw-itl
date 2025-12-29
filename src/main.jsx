import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from "./pages/inicio/inicio.jsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import InicioSesion from "./pages/inicio_sesion/inicio_sesion.jsx";
import TecnoBlog from "./pages/tecnoblog/tecnoblog.jsx";
import Tutorias from "./pages/tutorias/tutorias.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/tecnoblog" element={<TecnoBlog />} />
              <Route path="/tutorias" element={<Tutorias />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
