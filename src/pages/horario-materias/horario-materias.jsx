import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './horarios.module.css';

export default function Horarios() {
    const navigate = useNavigate();
    
    // Estados para los horarios
    const [horarios, setHorarios] = useState([]);
    const [semestreActual, setSemestreActual] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [materiasFiltradas, setMateriasFiltradas] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // Datos de ejemplo - Simulación de base de datos
    const datosHorariosEjemplo = {
        usuario: {
            id: 1,
            nombre: "Juan Pérez",
            matricula: "202512345",
            carrera: "Ingeniería en Sistemas Computacionales",
            semestre: 5
        },
        horarios: [
            {
                id: 1,
                semestre: "5",
                materia: "Base de Datos Avanzada",
                clave: "AED-1050",
                profesor: "Dr. Carlos Méndez",
                creditos: 5,
                lunes: "7:00-8:50 A-101",
                martes: "",
                miercoles: "7:00-8:50 A-101",
                jueves: "",
                viernes: "7:00-8:50 A-101"
            },
            {
                id: 2,
                semestre: "5",
                materia: "Desarrollo Web Avanzado",
                clave: "SCD-1015",
                profesor: "Mtra. Ana López",
                creditos: 5,
                lunes: "",
                martes: "9:00-10:50 Lab-1",
                miercoles: "",
                jueves: "9:00-10:50 Lab-1",
                viernes: "9:00-10:50 Lab-1"
            },
            {
                id: 3,
                semestre: "5",
                materia: "Inteligencia Artificial",
                clave: "AEB-1055",
                profesor: "Dr. Roberto Sánchez",
                creditos: 4,
                lunes: "11:00-12:50 B-205",
                martes: "",
                miercoles: "11:00-12:50 B-205",
                jueves: "",
                viernes: ""
            },
            {
                id: 4,
                semestre: "5",
                materia: "Redes de Computadoras",
                clave: "SCD-1020",
                profesor: "Ing. Laura Fernández",
                creditos: 5,
                lunes: "",
                martes: "7:00-8:50 Lab-2",
                miercoles: "",
                jueves: "7:00-8:50 Lab-2",
                viernes: "9:00-10:50 Lab-2"
            },
            {
                id: 5,
                semestre: "5",
                materia: "Ingeniería de Software",
                clave: "SCD-1008",
                profesor: "C.P. Miguel Torres",
                creditos: 4,
                lunes: "13:00-14:50 C-301",
                martes: "",
                miercoles: "13:00-14:50 C-301",
                jueves: "",
                viernes: ""
            },
            {
                id: 6,
                semestre: "5",
                materia: "Sistemas Operativos",
                clave: "AED-1045",
                profesor: "Dr. Jorge Ramírez",
                creditos: 5,
                lunes: "9:00-10:50 Lab-3",
                martes: "",
                miercoles: "9:00-10:50 Lab-3",
                jueves: "",
                viernes: "11:00-12:50 Lab-3"
            },
            {
                id: 7,
                semestre: "5",
                materia: "Taller de Investigación I",
                clave: "ACA-0909",
                profesor: "Lic. Patricia Gómez",
                creditos: 4,
                lunes: "",
                martes: "11:00-12:50 D-102",
                miercoles: "",
                jueves: "11:00-12:50 D-102",
                viernes: ""
            }
        ]
    };

    // Días de la semana para la tabla
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Cargar datos iniciales
    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            const usuario = datosHorariosEjemplo.usuario;
            const semestreUsuario = usuario.semestre.toString();
            
            // Solo cargar materias del semestre actual
            const materiasSemestreActual = datosHorariosEjemplo.horarios.filter(
                h => h.semestre === semestreUsuario
            );
            
            setHorarios(materiasSemestreActual);
            setSemestreActual(semestreUsuario);
            setMateriasFiltradas(materiasSemestreActual);
            setCargando(false);
        }, 1000);
    }, []);

    // Filtrar materias por búsqueda
    useEffect(() => {
        if (busqueda.trim() === '') {
            setMateriasFiltradas(horarios);
        } else {
            const filtradas = horarios.filter(materia =>
                materia.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
                materia.clave.toLowerCase().includes(busqueda.toLowerCase()) ||
                materia.profesor.toLowerCase().includes(busqueda.toLowerCase())
            );
            setMateriasFiltradas(filtradas);
        }
    }, [busqueda, horarios]);

    // Generar color único para cada materia
    const generarColor = (id) => {
        const colores = [
            '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', 
            '#ef6c00', '#00838f', '#7b1fa2', '#2e7d32'
        ];
        return colores[id % colores.length];
    };

    // Función para formatear el horario de un día
    const formatearHorarioDia = (horario) => {
        if (!horario || horario.trim() === '') {
            return <span className={styles.sinClase}>-</span>;
        }
        
        const [horas, aula] = horario.split(' ');
        const [inicio, fin] = horas.split('-');
        
        return (
            <div className={styles.horarioDia}>
                <span className={styles.hora}>{inicio} - {fin}</span>
                <span className={styles.aula}>{aula}</span>
            </div>
        );
    };

    // Calcular estadísticas
    const totalCreditos = materiasFiltradas.reduce((sum, materia) => sum + materia.creditos, 0);
    const totalMaterias = materiasFiltradas.length;

    return (
        <Seccion title="HORARIO ACADÉMICO">
            <div className={styles.pageContainer}>
                {/* Información del usuario y semestre */}
                <div className={styles.headerInfo}>
                    <div className={styles.usuarioInfo}>
                        <div className={styles.usuarioHeader}>
                            <i className="fas fa-user-graduate"></i>
                            <h2>Horario del {semestreActual}° Semestre</h2>
                        </div>
                        <div className={styles.usuarioDetails}>
                            <div className={styles.usuarioItem}>
                                <span className={styles.label}>Estudiante:</span>
                                <span className={styles.value}>{datosHorariosEjemplo.usuario.nombre}</span>
                            </div>
                            <div className={styles.usuarioItem}>
                                <span className={styles.label}>Matrícula:</span>
                                <span className={styles.value}>{datosHorariosEjemplo.usuario.matricula}</span>
                            </div>
                            <div className={styles.usuarioItem}>
                                <span className={styles.label}>Carrera:</span>
                                <span className={styles.value}>{datosHorariosEjemplo.usuario.carrera}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Estadísticas rápidas */}
                    <div className={styles.estadisticasHeader}>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-book"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>{totalMaterias}</span>
                                <span className={styles.estadisticaLabel}>Materias</span>
                            </div>
                        </div>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-star"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>{totalCreditos}</span>
                                <span className={styles.estadisticaLabel}>Créditos</span>
                            </div>
                        </div>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-calendar-alt"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>{semestreActual}°</span>
                                <span className={styles.estadisticaLabel}>Semestre</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Búsqueda */}
                <div className={styles.busquedaContainer}>
                    <div className={styles.searchBox}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar materia, clave o profesor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className={styles.searchInput}
                        />
                        {busqueda && (
                            <button 
                                className={styles.clearSearch}
                                onClick={() => setBusqueda('')}
                                aria-label="Limpiar búsqueda"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    <p className={styles.searchHint}>
                        {busqueda 
                            ? `Mostrando ${materiasFiltradas.length} de ${horarios.length} materias`
                            : `Mostrando todas las materias del ${semestreActual}° semestre`
                        }
                    </p>
                </div>

                {/* Contenido principal */}
                <main className={styles.contenido}>
                    {cargando ? (
                        <div className={styles.cargando}>
                            <i className="fas fa-spinner fa-spin fa-2x"></i>
                            <p>Cargando horario...</p>
                        </div>
                    ) : materiasFiltradas.length > 0 ? (
                        <>
                            {/* Tabla de horarios */}
                            <div className={styles.tablaContainer}>
                                <h3 className={styles.tituloTabla}>
                                    <i className="fas fa-table"></i>
                                    Horario de Clases
                                </h3>
                                
                                <div className={styles.tablaWrapper}>
                                    <table className={styles.tablaHorario}>
                                        <thead>
                                            <tr>
                                                <th className={styles.colMateria}>Materia</th>
                                                <th className={styles.colCreditos}>Créditos</th>
                                                <th className={styles.colProfesor}>Profesor</th>
                                                {diasSemana.map(dia => (
                                                    <th key={dia} className={styles.colDia}>{dia}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materiasFiltradas.map((materia, index) => (
                                                <tr key={materia.id} className={index % 2 === 0 ? styles.filaPar : styles.filaImpar}>
                                                    <td className={styles.cellMateria}>
                                                        <div className={styles.materiaInfo}>
                                                            <strong className={styles.nombreMateria}>{materia.materia}</strong>
                                                            <span className={styles.claveMateria}>{materia.clave}</span>
                                                        </div>
                                                    </td>
                                                    <td className={styles.cellCreditos}>
                                                        <span className={styles.creditosBadge}>
                                                            {materia.creditos}
                                                        </span>
                                                    </td>
                                                    <td className={styles.cellProfesor}>
                                                        <div className={styles.profesorInfo}>
                                                            <i className="fas fa-chalkboard-teacher"></i>
                                                            <span>{materia.profesor}</span>
                                                        </div>
                                                    </td>
                                                    {/* Días de la semana */}
                                                    <td className={styles.cellDia}>
                                                        {formatearHorarioDia(materia.lunes)}
                                                    </td>
                                                    <td className={styles.cellDia}>
                                                        {formatearHorarioDia(materia.martes)}
                                                    </td>
                                                    <td className={styles.cellDia}>
                                                        {formatearHorarioDia(materia.miercoles)}
                                                    </td>
                                                    <td className={styles.cellDia}>
                                                        {formatearHorarioDia(materia.jueves)}
                                                    </td>
                                                    <td className={styles.cellDia}>
                                                        {formatearHorarioDia(materia.viernes)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Leyenda de colores */}
                            <div className={styles.leyendaContainer}>
                                <h4>
                                    <i className="fas fa-info-circle"></i>
                                    Información del Horario
                                </h4>
                                <div className={styles.leyendaItems}>
                                    <div className={styles.leyendaItem}>
                                        <div className={styles.leyendaColor} style={{background: '#f1f8e9'}}></div>
                                        <span>Clase de 2 horas</span>
                                    </div>
                                    <div className={styles.leyendaItem}>
                                        <div className={styles.leyendaColor} style={{background: '#f3e5f5'}}></div>
                                        <span>Clase de 3 horas</span>
                                    </div>
                                    <div className={styles.leyendaItem}>
                                        <i className="fas fa-door-open"></i>
                                        <span>Aula/Laboratorio</span>
                                    </div>
                                    <div className={styles.leyendaItem}>
                                        <i className="fas fa-clock"></i>
                                        <span>Formato: Hora Inicio - Hora Fin</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.sinResultados}>
                            <div className={styles.sinResultadosIcon}>
                                <i className="fas fa-search fa-3x"></i>
                            </div>
                            <div className={styles.sinResultadosContent}>
                                <h3>No se encontraron materias</h3>
                                <p>
                                    {busqueda 
                                        ? `No hay resultados para "${busqueda}" en el ${semestreActual}° semestre`
                                        : `No hay materias registradas para el ${semestreActual}° semestre`
                                    }
                                </p>
                                {busqueda && (
                                    <button 
                                        className={styles.btnLimpiarBusqueda}
                                        onClick={() => setBusqueda('')}
                                    >
                                        <i className="fas fa-times"></i>
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* Acciones */}
                <div className={styles.accionesContainer}>
                    <button 
                        className={styles.btnImprimir}
                        onClick={() => window.print()}
                    >
                        <i className="fas fa-print"></i>
                        Imprimir Horario
                    </button>
                    <button 
                        className={styles.btnDescargar}
                        onClick={() => {
                            // En una app real, aquí se generaría un PDF
                            alert('Funcionalidad de descarga activada');
                        }}
                    >
                        <i className="fas fa-download"></i>
                        Descargar PDF
                    </button>
                </div>

                {/* Botón flotante para volver */}
                <button 
                    className={styles.btnFlotante}
                    onClick={() => navigate('/')}
                    aria-label="Volver al inicio"
                >
                    <i className="fas fa-arrow-left"></i>
                    Volver al Inicio
                </button>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerInfo}>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-university"></i>
                                    Información Importante
                                </h4>
                                <p>Los horarios están sujetos a cambios por parte de la administración.</p>
                                <p>Para reportar inconsistencias, contacta a Servicios Escolares.</p>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-clock"></i>
                                    Horario de Clases
                                </h4>
                                <p>Cada clase tiene una duración de 50 minutos por hora.</p>
                                <p>El horario mostrado corresponde al ciclo escolar actual.</p>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-envelope"></i>
                                    Contacto
                                </h4>
                                <p>servicios.escolares@leon.tecnm.mx</p>
                                <p>Tel: 477 710 0000 Ext. 1200</p>
                            </div>
                        </div>
                        <div className={styles.footerDerechos}>
                            <p className={styles.derechos}>
                                © 2025 TecNM León. Sistema de Horarios Académicos.
                            </p>
                            <p className={styles.infoAdicional}>
                                Horario del {semestreActual}° Semestre - {datosHorariosEjemplo.usuario.carrera}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}