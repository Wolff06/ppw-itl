import { useState, useEffect } from 'react';
import styles from './docentes.module.css';
import logoFondo from '../../assets/backgrounds/LogoTecNMVertical_Blanco-150x150(1).png';
import Seccion from "../../assets/templates/seccion/seccion.jsx";

// Importar imágenes
import profesorImg from '../../assets/profesores/profe.png';
import joseImg from '../../assets/profesores/José Gerardo.jpeg';
import ruthImg from '../../assets/profesores/Ruth.jpeg';
import patriciaImg from '../../assets/profesores/Patricia Maria.jpeg';
import carlosImg from '../../assets/profesores/usuario_icon.png';

export default function Docentes() {
    const [profesorActivo, setProfesorActivo] = useState(0);
    const [likes, setLikes] = useState({});
    const [dislikes, setDislikes] = useState({});

    // Datos de los profesores
    const profesores = [
        {
            id: 0,
            nombre: 'Ing. Luis Roberto Gallegos Muñoz',
            titulo: 'Ingeniero en Sistemas - Jefe de Departamento Académico',
            imagen: profesorImg,
            cita: 'Recuerden chicos, no quiero Robots deben formar su propio entendimiento solo así la capacidad se fortalece',
            enlace: 'profe'
        },
        {
            id: 1,
            nombre: 'Ing. José Gerardo Carpio Flores',
            titulo: 'Ingeniero en Sistemas Computacionales - Maestro en Ciencias de la Computación',
            imagen: joseImg,
            cita: 'En ocasiones debemos ser más que simples estudiantes, debemos ser exploradores del conocimiento y arquitectos de nuestro propio futuro.',
            enlace: 'José Gerardo'
        },
        {
            id: 2,
            nombre: 'Ing. Ruth Saez de Nanclares',
            titulo: 'Ingeniera en Sistemas Computacionales - Maestra de Automatas y Teoría de la Computación',
            imagen: ruthImg,
            cita: 'La educación es lo unico que nadie puede quitarnos, inviertan en ella.',
            enlace: 'Ruth'
        },
        {
            id: 3,
            nombre: 'Lic. Patricia Maria Castillo Martínez',
            titulo: 'Ingeniero en Sistemas - Maestra en Ciencias de la Computación',
            imagen: patriciaImg,
            cita: 'Acerquense al conocimiento con humildad y pasión, nadie lo sabe todo, pero juntos podemos descubrir mucho más.',
            enlace: 'Patricia Maria'
        },
        {
            id: 4,
            nombre: 'Ing. Carlos Alberto Trujillo Castellanos',
            titulo: 'Ingeniero en Sistemas - Jefe de Departamento Académico',
            imagen: carlosImg,
            cita: 'Atrevanse a hacer preguntas, cuestionen lo establecido y nunca dejen de aprender.',
            enlace: 'Carlos Alberto'
        }
    ];

    // Función para navegar al profesor anterior
    const profesorAnterior = () => {
        setProfesorActivo((prev) => (prev === 0 ? profesores.length - 1 : prev - 1));
    };

    // Función para navegar al siguiente profesor
    const siguienteProfesor = () => {
        setProfesorActivo((prev) => (prev === profesores.length - 1 ? 0 : prev + 1));
    };

    // Función para dar like
    const darLike = (profesorId) => {
        setLikes(prev => ({
            ...prev,
            [profesorId]: (prev[profesorId] || 0) + 1
        }));
    };

    // Función para dar dislike
    const darDislike = (profesorId) => {
        setDislikes(prev => ({
            ...prev,
            [profesorId]: (prev[profesorId] || 0) + 1
        }));
    };

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                profesorAnterior();
            } else if (e.key === 'ArrowRight') {
                siguienteProfesor();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [profesorActivo]);

    const profesorActual = profesores[profesorActivo];

    return (
        <Seccion title="Docentes"> 
            <div className={styles.pageContainer}>
                {/* Fondo de marca de agua */}
                <div 
                    className={styles.fondoMarcaAgua}
                    style={{ backgroundImage: `url(${logoFondo})` }}
                ></div>

                {/* Contenedor principal - NO incluyas navbar aquí */}
                <main className={styles.container}>
                    {/* Indicadores de navegación (puntos) */}
                    <div className={styles.indicadores}>
                        {profesores.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.indicator} ${
                                    profesorActivo === index ? styles.indicatorActivo : ''
                                }`}
                                onClick={() => setProfesorActivo(index)}
                                aria-label={`Ir al profesor ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Botones de navegación */}
                    <button 
                        className={styles.navButtonPrev}
                        onClick={profesorAnterior}
                        aria-label="Profesor anterior"
                    >
                        ❮
                    </button>
                    
                    <button 
                        className={styles.navButtonNext}
                        onClick={siguienteProfesor}
                        aria-label="Siguiente profesor"
                    >
                        ❯
                    </button>

                    {/* Contenedor de tarjetas */}
                    <div className={styles.cardsContainer}>
                        {/* Tarjeta activa */}
                        <div 
                            className={`${styles.card} ${styles.cardActiva}`}
                            key={profesorActual.id}
                        >
                            {/* Logo del TecNM en el fondo de la tarjeta - MÁS GRANDE */}
                            <div className={styles.cardLogoFondo}></div>
                            
                            {/* Contenido de la tarjeta */}
                            <div className={styles.cardContent}>
                                <p className={styles.quote}>
                                    "{profesorActual.cita}"
                                </p>
                                
                                <div className={styles.imagenContainer}>
                                    <img 
                                        src={profesorActual.imagen} 
                                        alt={profesorActual.nombre} 
                                        className={styles.authorImg}
                                    />
                                </div>
                                
                                <div className={styles.authorName}>
                                    {profesorActual.nombre}
                                </div>
                                
                                <div className={styles.authorTitle}>
                                    {profesorActual.titulo}
                                </div>

                                {/* Botones de Like y Dislike */}
                                <div className={styles.reacciones}>
                                    <button 
                                        className={styles.likeButton}
                                        onClick={() => darLike(profesorActual.id)}
                                        aria-label="Dar like"
                                    >
                                        <i className="fas fa-thumbs-up"></i>
                                        <span className={styles.contadorReaccion}>
                                            {likes[profesorActual.id] || 0}
                                        </span>
                                    </button>
                                    
                                    <button 
                                        className={styles.dislikeButton}
                                        onClick={() => darDislike(profesorActual.id)}
                                        aria-label="Dar dislike"
                                    >
                                        <i className="fas fa-thumbs-down"></i>
                                        <span className={styles.contadorReaccion}>
                                            {dislikes[profesorActual.id] || 0}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del profesor actual */}
                    <div className={styles.infoProfesor}>
                        <span className={styles.contador}>
                            {profesorActivo + 1} / {profesores.length}
                        </span>
                    </div>
                </main>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <p className={styles.derechos}>
                            © 2025 TecNM León. Departamento Académico de Sistemas.
                        </p>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}