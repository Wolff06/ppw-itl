import { useState, useMemo } from 'react';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './planes.module.css';

export default function PlanesEstudio() {
    const [busqueda, setBusqueda] = useState('');
    
    // Lista completa de materias organizada por semestres
    const materiasPorSemestre = useMemo(() => [
        {
            id: 1,
            nombre: '1er Semestre',
            materias: [
                {
                    id: 1,
                    nombre: 'Cálculo Diferencial',
                    url: 'https://www.tecnm.mx/normateca/Direcci%C3%B3n%20de%20Docencia%20e%20Innovaci%C3%B3n%20Educativa/Actualizaci%C3%B3n%20de%20los%20programas%20de%20Estudio/PROGRAMA_CALCULO_DIFERENCIAL_2024.pdf'
                },
                {
                    id: 2,
                    nombre: 'Fundamentos de Programación',
                    url: 'https://www.apizaco.tecnm.mx/wp-content/uploads/2021/12/AEF1032.pdf'
                },
                {
                    id: 3,
                    nombre: 'Taller de Ética',
                    url: 'https://www.tecnm.mx/normateca/Direcci%C3%B3n%20de%20Docencia%20e%20Innovaci%C3%B3n%20Educativa/Actualizaci%C3%B3n%20de%20los%20programas%20de%20Estudio/PROGRAMA_TALLER_ETICA_2024.pdf'
                },
                {
                    id: 5,
                    nombre: 'Matematicás Discretas',
                    url: 'https://apatzingan.tecnm.mx/wp-content/uploads/2025/06/AEF1041-Matematicas-Discretas.pdf'
                },
                {
                    id: 6,
                    nombre: 'Taller de Administración',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/ISC/PDFS-ISC/SCH-1024-Taller%20de%20Administracion.pdf'
                },
                {
                    id: 7,
                    nombre: 'Fundamentos de Investigación ',
                    url: 'https://www.apizaco.tecnm.mx/wp-content/uploads/2021/12/ACC0906.pdf'
                }

                
            ]
        },
        {
            id: 2,
            nombre: '2do Semestre',
            materias: [
                {
                    id: 8,
                    nombre: 'Programación Orientada a Objetos',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/ISC/PDFS-ISC/AED-1286-Programacion%20orientada%20a%20objetos.pdf'
                },
                {
                    id: 9,
                    nombre: 'Contabilidad Financiera',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/ISC/PDFS-ISC/AEC-1008-Contabilidad%20financiera.pdf'
                },
                {
                    id: 10,
                    nombre: 'Cálculo Integral',
                    url: 'https://studylib.es/doc/9302052/acf-0902-calculo-integral-programa?p=2'
                },
                {
                    id: 11,
                    nombre: 'Química General',
                    url: 'https://www.studocu.com/es-mx/document/universidad-autonoma-de-occidente-mexico/quimica-general/aec-1058-quimica-sistemas/23340703'
                },
                {
                    id: 12,
                    nombre: 'Álgebra Lineal',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/IGE/PDFS-IGE/ACF-0903-Algebra%20Lineal.pdf'
                },
                {
                    id: 13,
                    nombre: 'Probabilidad y Estadística',
                    url: ''
                }

            ]
        },
        {
            id: 3,
            nombre: '3er Semestre',
            materias: [
                {
                    id: 14,
                    nombre: 'Estructura de Datos',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/ISC/PDFS-ISC/AED-1026-Estructura%20de%20datos.pdf'
                },
                {
                    id: 15,
                    nombre: 'Cultura Empresarial',
                    url: 'https://www.iztapalapa.tecnm.mx/Carreras/ISC/PDFS-ISC/SCC-1005-Cultura%20Empresarial.pdf'
                },
                {
                    id: 16,
                    nombre: 'Cálculo Vectorial',
                    url: ''
                },
                {
                    id: 17,
                    nombre: 'Investigación de Operaciones',
                    url: ''
                },
                {
                    id: 18,
                    nombre: 'Desarrollo Sustentable',
                    url: ''
                },
                {
                    id: 19,
                    nombre: 'Física General',
                    url: ''
                }

            ]
        },
        {
            id: 4,
            nombre: '4to Semestre',
            materias: [
                {
                    id: 20,
                    nombre: 'Ecuaciones Diferenciales',
                    url: '#'
                },
                {
                    id:21,
                    nombre: 'Método Numéricos',
                    url: '#'
                },
                {
                    id: 22,
                    nombre: 'Tópicos Avanzados de Programación',
                    url: ''
                },
                {
                    id: 23,
                    nombre: 'Simulación',
                    url: ''
                },
                {
                    id: 24,
                    nombre: 'Principios Eléctricos y Aplicaciones Digitales',
                    url: ''
                },
            ]
        },
        {
            id: 5,
            nombre: '5to Semestre',
            materias: [
                {
                    id: 25,
                    nombre: 'Graficación',
                    url: '#'
                },
                {
                    id: 26,
                    nombre: 'Fundamentos de Telecomunicaciones',
                    url: '#'
                },
                {
                    id: 27,
                    nombre: 'Sistemas Operativos',
                    url: ''
                },
                {
                    id: 28,
                    nombre: 'Taller de Base de Datos',
                    url: ''
                },
                {
                    id: 29,
                    nombre: 'Fundamentos de Ingeniería de Software',
                    url: ''
                },
                {
                    id: 30,
                    nombre: 'Arquitectura de Computadoras',
                    url: ''
                },
            
            ]
        },
        {
         id: 6,
            nombre: '6to Semestre',
            materias: [
                {
                    id: 31,
                    nombre: 'Lenguajes y Autómatas I',
                    url: '#'
                },
                {
                    id: 32,
                    nombre: 'Redes de Computadoras',
                    url: '#'
                },
                {
                    id: 33,
                    nombre: 'Taller de Sistemas Operativos',
                    url: ''
                },
                {
                    id: 34,
                    nombre: 'Administración de Base de Datos',
                    url: ''
                },
                {
                    id: 35,
                    nombre: 'Ingeniería de Software',
                    url: ''
                },
                {
                    id: 36,
                    nombre: 'Lenguajes de Interfaz',
                    url: ''
                },
            
            ]   
        },
        {
            id: 7,
            nombre: '7mo Semestre',
            materias: [
                {
                    id: 37,
                    nombre: 'Lenguajes y Autómatas II',
                    url: '#'
                },
                {
                    id: 38,
                    nombre: 'Conmutación y Enrutamiento de Redes',
                    url: '#'
                },
                {
                    id: 39,
                    nombre: 'Taller de Investigación I',
                    url: ''
                },
                {
                    id: 40,
                    nombre: 'Gestión de Proyectos de Software',
                    url: ''
                },
                {
                    id: 41,
                    nombre: 'Sistemas Programables',
                    url: ''
                },
            
            ]
        }
    ], []);
    
    // Filtrar materias basado en la búsqueda
    const semestresFiltrados = useMemo(() => {
        if (!busqueda.trim()) return materiasPorSemestre;
        
        const busquedaLower = busqueda.toLowerCase().trim();
        
        return materiasPorSemestre
            .map(semestre => ({
                ...semestre,
                materias: semestre.materias.filter(materia =>
                    materia.nombre.toLowerCase().includes(busquedaLower)
                )
            }))
            .filter(semestre => semestre.materias.length > 0);
    }, [busqueda, materiasPorSemestre]);
    
    // Contador de resultados
    const totalResultados = useMemo(() => {
        return semestresFiltrados.reduce((total, semestre) => 
            total + semestre.materias.length, 0
        );
    }, [semestresFiltrados]);
    
    // Manejar tecla Enter en el buscador
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Buscando:', busqueda);
        }
    };
    
    // Limpiar búsqueda
    const limpiarBusqueda = () => {
        setBusqueda('');
    };
    
    // Función para resaltar el texto de búsqueda
    const resaltarTexto = (texto, busqueda) => {
        if (!busqueda.trim()) return texto;
        
        const busquedaLower = busqueda.toLowerCase();
        const textoLower = texto.toLowerCase();
        const indice = textoLower.indexOf(busquedaLower);
        
        if (indice === -1) return texto;
        
        const antes = texto.substring(0, indice);
        const coincidencia = texto.substring(indice, indice + busqueda.length);
        const despues = texto.substring(indice + busqueda.length);
        
        return (
            <>
                {antes}
                <strong className={styles.resaltado}>{coincidencia}</strong>
                {despues}
            </>
        );
    };

    return (
        <Seccion title="Planes de Estudio">
            <div className={styles.contenedorPrincipal}>
                {/* Buscador */}
                <div className={styles.buscadorContainer}>
                    <div className={styles.buscadorWrapper}>
                        <input 
                            type="text" 
                            placeholder="Buscar materia (ej: 'cálculo', 'programación')..." 
                            className={styles.buscadorInput}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <i className={`fas fa-search ${styles.buscadorIcono}`}></i>
                        
                        {busqueda && (
                            <button 
                                className={styles.botonLimpiar}
                                onClick={limpiarBusqueda}
                                aria-label="Limpiar búsqueda"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    
                    {busqueda && (
                        <div className={styles.infoResultados}>
                            <span className={styles.contadorResultados}>
                                {totalResultados} materia{totalResultados !== 1 ? 's' : ''} encontrada{totalResultados !== 1 ? 's' : ''}
                            </span>
                            <button 
                                onClick={limpiarBusqueda}
                                className={styles.enlaceLimpiar}
                            >
                                Mostrar todas
                            </button>
                        </div>
                    )}
                </div>

                {/* Contenido de materias */}
                <div className={styles.contenidoMaterias}>
                    {busqueda && semestresFiltrados.length === 0 ? (
                        <div className={styles.sinResultados}>
                            <i className="fas fa-search"></i>
                            <h3>No se encontraron materias</h3>
                            <p>No hay resultados para "<strong>{busqueda}</strong>"</p>
                            <button 
                                onClick={limpiarBusqueda}
                                className={styles.botonPrincipal}
                            >
                                Ver todas las materias
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header de búsqueda */}
                            {busqueda && semestresFiltrados.length > 0 && (
                                <div className={styles.headerBusqueda}>
                                    <h3>Resultados para: "{busqueda}"</h3>
                                    <p>Mostrando {totalResultados} materia{totalResultados !== 1 ? 's' : ''}</p>
                                </div>
                            )}
                            
                            {/* Lista de semestres */}
                            {semestresFiltrados.map((semestre) => (
                                <div key={semestre.id} className={styles.semestre}>
                                    <h2 className={styles.tituloSemestre}>{semestre.nombre}</h2>
                                    
                                    {semestre.materias.length > 0 ? (
                                        <ul className={styles.listaMaterias}>
                                            {semestre.materias.map((materia) => (
                                                <li key={materia.id} className={styles.itemMateria}>
                                                    <a 
                                                        href={materia.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={styles.enlaceMateria}
                                                    >
                                                        {resaltarTexto(materia.nombre, busqueda)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.sinMaterias}>
                                            No hay materias en este semestre que coincidan con la búsqueda.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                
                {/* Botón de descarga */}
                <div className={styles.seccionDescarga}>
                    <button 
                        className={styles.botonDescarga}
                        onClick={() => alert('Funcionalidad de descarga completa por implementar')}
                    >
                        <i className="fas fa-download"></i> Descargar todos los temarios
                    </button>
                </div>
            </div>
        </Seccion>
    );
}