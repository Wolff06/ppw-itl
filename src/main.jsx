import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from "./pages/inicio/inicio.jsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import InicioSesion from "./pages/inicio_sesion/inicio_sesion.jsx";
import TecnoBlog from "./pages/tecnoblog/tecnoblog.jsx";
import Tutorias from "./pages/tutorias/tutorias.jsx";
import Calendario from "./pages/calendario/calendario.jsx";
import PlanesEstudio from "./pages/temarios/planes_estudio.jsx";
import Docentes from "./pages/docentes/docentes.jsx";
import Residencias from "./pages/residencias/residencias.jsx";
import Solicitudes from './pages/residencias/solicitudes.jsx';
import Horarios from './pages/horario-materias/horario-materias.jsx';
import Reportes from './pages/reportes/reportes.jsx';
import Examenes from './pages/examen-psicometricos/examen-psicometrico.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/tecnoblog" element={<TecnoBlog />} />
              <Route path="/tutorias" element={<Tutorias />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/docentes" element={<Docentes/>} />
              <Route path="/planes-estudio" element={<PlanesEstudio />} />
              <Route path="/residencias" element={<Residencias />} />
              <Route path="/solicitudes" element={<Solicitudes />} />
              <Route path="/temarios-materias" element={<Horarios />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/examenes-psicometricos" element={<Examenes />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
