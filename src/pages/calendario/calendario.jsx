import { useState } from 'react';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from "./calendario.module.css";


// Importar todas las imágenes
import img1 from '../../assets/backgrounds/1.png';
import img2 from '../../assets/backgrounds/2.png';
import img3 from '../../assets/backgrounds/3.png';
import img4 from '../../assets/backgrounds/4.png';
import img5 from '../../assets/backgrounds/5.png';
import img6 from '../../assets/backgrounds/6.png';
import img7 from '../../assets/backgrounds/7.png';
import leyendaImg from '../../assets/backgrounds/leyenda.png';

export default function Calendario() {
    const [mesActual, setMesActual] = useState(4); // Empieza en mes 5 
    
    const meses = [
        { id: 1, nombre: "Enero", img: img1 },
        { id: 2, nombre: "Febrero", img: img2 },
        { id: 3, nombre: "Marzo", img: img3 },
        { id: 4, nombre: "Abril", img: img4 },
        { id: 5, nombre: "Mayo", img: img5 },
        { id: 6, nombre: "Junio", img: img6 },
        { id: 7, nombre: "Julio", img: img7 },
    ];
    
    const irAlMesAnterior = () => {
        setMesActual((prev) => (prev === 0 ? meses.length - 1 : prev - 1));
    };
    
    const irAlMesSiguiente = () => {
        setMesActual((prev) => (prev === meses.length - 1 ? 0 : prev + 1));
    };
    
    const mes = meses[mesActual];

    return (
        <Seccion title="Calendario Escolar">     
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></link>
            <div className={styles.contenido}>
                <div className={styles.calendario}>
                    {/* Imagen del mes actual */}
                    <img 
                        key={mes.id}
                        className={styles['imagen-mes']} 
                        src={mes.img} 
                        alt={`Calendario ${mes.nombre}`}
                    />
                    
                    {/* Botones de navegación */}
                    <div className={styles['nav-meses']}>
                        <button 
                            onClick={irAlMesAnterior}
                            className={`${styles['nav-btn']} ${styles['nav-prev']}`}
                            aria-label="Mes anterior"
                        >
                            <i className="fas fa-caret-up"></i>
                        </button>
                        
                        <button 
                            onClick={irAlMesSiguiente}
                            className={`${styles['nav-btn']} ${styles['nav-next']}`}
                            aria-label="Mes siguiente"
                        >
                            <i className="fas fa-caret-down"></i>
                        </button>
                    </div>
                    
                    {/* Indicadores de meses (puntos) */}
                    <div className={styles.indicadores}>
                        {meses.map((mesItem, index) => (
                            <button
                                key={mesItem.id}
                                onClick={() => setMesActual(index)}
                                className={`${styles.indicador} ${index === mesActual ? styles.activo : ''}`}
                                aria-label={`Ir a ${mesItem.nombre}`}
                            />
                        ))}
                    </div>
                </div>
                
                <div className={styles['contenedor-leyenda']}>
                    <img 
                        className={styles.leyenda} 
                        src={leyendaImg} 
                        alt="Leyenda del calendario"
                    />
                </div>
                
                <footer className={styles.footer}>
                    <a 
                        href="https://leon.tecnm.mx/wp-content/uploads/2025/01/CALENDARIO-ESCOLAR-ENE-JUN-2025-FE-DE-ERRATAS.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Descargar Calendario Escolar
                    </a>
                </footer>
            </div>
        </Seccion>
    );
}