import styles from "./Inicio.module.css";
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/logos/LogoTecNM.png';
import leonbotImg from '../../assets/icons/leonbot.png'; 
import usuarioIcon from '../../assets/profesores/usuario_icon.png'; 
import universitariosBg from '../../assets/backgrounds/universitarios.jpg';
import {handleLogout} from "../../assets/scripts/serverless/auth.js";

export default function Inicio() {
    const navigate = useNavigate();
    const [mostrarCerrarSesion, setMostrarCerrarSesion] = useState(false);
    
    const logout = () => {
        handleLogout().then(()=> navigate("/"));
        // redirigimos al login
        //navigate("/login");
    };
    
    const toggleCerrarSesion = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setMostrarCerrarSesion(!mostrarCerrarSesion);
    };
    
    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => {
            if (mostrarCerrarSesion) {
                setMostrarCerrarSesion(false);
            }
        };
        
        if (mostrarCerrarSesion) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [mostrarCerrarSesion]);
        // Verificar autenticación al cargar (opcional - para seguridad adicional)
        useEffect(() => {
        const verificarAutenticacion = () => {
            const token = localStorage.getItem('authToken') || 
                         sessionStorage.getItem('authToken') ||
                         document.cookie.includes('authToken');
            
            // Si no hay token, redirigir al login
            if (!token) {
                //navigate("/login");
            }
        };
        
        verificarAutenticacion();
    }, [navigate]);
    
    // Función para redirigir a enlaces externos
    const redirectToExternal = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className={styles.pageContainer}>
            {/* Navbar Superior - IDENTICO al diseño original */}
            <nav className={styles.navbar}>
                <div onClick={() => redirectToExternal("https://aula.itleon.edu.mx/")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>Aula Virtual</Link>
                </div>
                <div onClick={() => redirectToExternal("https://itleon.bibliotecasdigitales.com/auth/login")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>Centro de Información</Link>
                </div>
                <div onClick={() => redirectToExternal("https://sites.google.com/leon.tecnm.mx/bolsa-de-trabajo/inicio")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>Alianzas con el TECNM LEÓN</Link>
                </div>
                <div onClick={() => redirectToExternal("https://cetech.leon.tecnm.mx/")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>CETECH</Link>
                </div>
                <div onClick={() => redirectToExternal("https://www.taekukmusul.com.mx/tecleon/inicial.php")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>Actividades Extraescolares</Link>
                </div>
                <div onClick={() => redirectToExternal("https://www.facebook.com/Itllenguasextranjeras/")}>
                    <Link to="#" onClick={(e) => e.preventDefault()}>Idiomas</Link>
                </div>
                
                {/* Contenedor de usuario - SIEMPRE con ícono (porque estamos en inicio) */}
                <div className={styles.userContainer}>
                    <img 
                        src={usuarioIcon} 
                        alt="icono_user" 
                        className={styles.iconoUsuario}
                        onClick={toggleCerrarSesion}
                    />
                    {mostrarCerrarSesion && (
                        <div 
                            className={styles.cierreSesion}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Link to="#" onClick={logout}>
                                Cerrar sesión <i className="fas fa-sign-out-alt"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Banner con imagen de fondo */}
            <div 
                className={styles.banner}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${universitariosBg})`
                }}
            >
                <div className={styles.bannerContent}>
                    <img src={logo} alt="TecNM León Logo" className={styles.bannerLogo} />
                    <h1>Instituto Tecnológico León</h1>
                </div>
            </div>

            {/* Contenido Principal - 4 columnas*/}
            <main className={styles.content}>
                {/* Columna 1: LeonBot */}
                <div className={`${styles.column} ${styles.leonbotColumn}`}>
                    <h3>Instituto Tecnológico León</h3>
                    <div className={styles.leonbotContainer}>
                        <table className={styles.leonbotTable}>
                            <tbody>
                                <tr>
                                    <td>
                                        ¿Tienes alguna duda? <br /> Prueba nuestro LeonBot.
                                    </td>
                                    <td>
                                        <img src={leonbotImg} alt="LeonBot" className={styles.leonbotImg} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.leonbotInput}>
                            <input 
                                type="text" 
                                placeholder="Pon tu duda aquí" 
                                className={styles.leonbotInputField}
                            />
                            <button className={styles.leonbotButton}>
                                <Link to="/chatbot">
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna 2: Módulos */}
                <div className={styles.column}>
                    <h3>Módulos</h3>
                    <ul className={styles.listaModulos}>
                        <li><Link to="/residencias">Residencias</Link></li>
                        <li><Link to="/reportes">Reportes Académicos</Link></li>
                        <li><Link to="/horario-materias">Horario y Materias</Link></li>
                        <li><Link to="/examenes-psicometricos">Examenes Psicométricos</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Información */}
                <div className={styles.column}>
                    <h3>Información</h3>
                    <ul className={styles.listaModulos}>
                        <li><Link to="/docentes">Conoce nuestros Docentes</Link></li>
                        <li><Link to="/tecnoblog">Foro</Link></li>
                        <li><Link to="/tutorias">Grupos de Tutorías</Link></li>
                        <li><Link to="/calendario">Calendario Escolar</Link></li>
                        <li><Link to="/planes-estudio">Temario de Materias</Link></li>
                    </ul>
                </div>

                {/* Columna 4: Contactos */}
                <div className={styles.column}>
                    <h3>Contactos</h3>
                    <ul className={styles.listaModulos}>
                        <li className={styles.menuConSubmenu}>
                            Croquis Campus
                            <ul className={styles.submenu}>
                                <li>
                                    <Link to="#" onClick={() => redirectToExternal("https://leon.tecnm.mx/campus-i/")}>
                                        Campus I
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={() => redirectToExternal("https://leon.tecnm.mx/campus-ii/")}>
                                        Campus II
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="#" onClick={() => redirectToExternal("https://leon.tecnm.mx/directorio/")}>
                                Directorio
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => redirectToExternal("https://www.instagram.com/tecnm_itleon?igsh=eXAzYzNqbmJnZHV3")}>
                                Instagram
                            </Link>
                        </li>
                    </ul>
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    © Tecnológico Nacional. All Rights Reserved 2023
                    <a 
                        href="https://www.gob.mx/terminos" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Terms & Conditions
                    </a>
                </div>
            </footer>
        </div>
    );
}