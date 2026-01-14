import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './horarios.module.css';
import { useAuth } from '../../context/authContext'; 
import { supabase } from '../../lib/supabase'; // Descomenta esto

export default function Horarios() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    
    // ⭐ TODOS LOS HOOKS AL PRINCIPIO, ANTES DE CUALQUIER CONDICIONAL
    const [horarios, setHorarios] = useState([]);
    const [semestreActual, setSemestreActual] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [materiasFiltradas, setMateriasFiltradas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // Días de la semana para la tabla
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // ⭐ Verificación de autenticación
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // ⭐ Cargar horario solo si está autenticado
    useEffect(() => {
        const cargarHorario = async () => {
            // Si no está autenticado o aún está cargando, no hacer nada
            if (authLoading || !isAuthenticated || !user || !user.id) {
                return;
            }

            try {
                setCargando(true);
                setError('');
                
                // 1. Obtener semestre y carrera del alumno
                const { data: alumnoData, error: alumnoError } = await supabase
                    .from('alumno')
                    .select('semestre, carrera')
                    .eq('no_control', user.id)
                    .single();
                    
                if (alumnoError) throw alumnoError;
                
                if (alumnoData) {
                    setSemestreActual(alumnoData.semestre);
                    // Actualizar usuario en localStorage con semestre
                    const updatedUser = {
                        ...user,
                        Semestre: alumnoData.semestre,
                        Carrera: alumnoData.carrera
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                }

                // 2. Obtener horario del alumno desde la vista
                const { data: horarioData, error: horarioError } = await supabase
                    .from('vista_horario_alumno')
                    .select('*')
                    .eq('id_alumno', user.id);
                   
                if (horarioError) throw horarioError;

                // 3. Procesar datos (pasar semestre como parámetro)
                const horariosProcesados = procesarHorariosParaTabla(
                    horarioData, 
                    alumnoData?.semestre || '6'
                );
                
                setHorarios(horariosProcesados);
                setMateriasFiltradas(horariosProcesados);
                
            } catch (err) {
                console.error('Error al cargar horario:', err);
                setError('Error al cargar el horario. Intente más tarde.');
                
                // Mostrar datos de ejemplo como respaldo
                const datosEjemplo = obtenerDatosEjemplo();
                setHorarios(datosEjemplo);
                setMateriasFiltradas(datosEjemplo);
                setSemestreActual(user?.Semestre || '6');
            } finally {
                setCargando(false);
            }
        };
        
        cargarHorario();
    }, [user, isAuthenticated, authLoading]); // ⭐ Dependencias correctas

    // Función para procesar los datos del horario (con parámetro de semestre)
    const procesarHorariosParaTabla = (data, semestreParam) => {
        // Agrupar por materia
        const materiasAgrupadas = {};
        
        // Verificar que haya datos
        if (!data || data.length === 0) {
            return [];
        }
        
        data.forEach(item => {
            const clave = `${item.id_materia}-${item.materia_nombre}`;

            if (!materiasAgrupadas[clave]) {
                materiasAgrupadas[clave] = {
                    id: item.id_materia,
                    semestre: semestreParam.toString(),
                    materia: item.materia_nombre,
                    clave: item.id_materia.toString(),
                    profesor: item.profesor_nombre,
                    creditos: item.creditos,
                    lunes: '',
                    martes: '',
                    miercoles: '',
                    jueves: '',
                    viernes: ''
                };
            }
            
            // Procesar días (verificar que dias_semana exista)
            if (item.dias_semana) {
                const dias = item.dias_semana.split(',').map(d => d.trim());
                const hora = item.hora_clase || `${item.hora_inicio}-${item.hora_fin}`;
                
                dias.forEach(dia => {
                    const diaNormalizado = dia.toLowerCase();
                    
                    if (diaNormalizado.includes('lunes')) {
                        materiasAgrupadas[clave].lunes = hora;
                    } else if (diaNormalizado.includes('martes')) {
                        materiasAgrupadas[clave].martes = hora;
                    } else if (diaNormalizado.includes('miércoles') || diaNormalizado.includes('miercoles')) {
                        materiasAgrupadas[clave].miercoles = hora;
                    } else if (diaNormalizado.includes('jueves')) {
                        materiasAgrupadas[clave].jueves = hora;
                    } else if (diaNormalizado.includes('viernes')) {
                        materiasAgrupadas[clave].viernes = hora;
                    }
                });
            }
        });
        
        return Object.values(materiasAgrupadas);
    };

    // Función para datos de ejemplo (respaldo)
    const obtenerDatosEjemplo = () => {
        return [
            {
                id: 1,
                semestre: "6",
                materia: "Base de Datos Avanzada",
                clave: "39358",
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
                semestre: "6",
                materia: "Desarrollo Web Avanzado",
                clave: "39357",
                profesor: "Mtra. Ana López",
                creditos: 5,
                lunes: "",
                martes: "9:00-10:50 Lab-1",
                miercoles: "",
                jueves: "9:00-10:50 Lab-1",
                viernes: "9:00-10:50 Lab-1"
            },
            // ... (mantén tus otros datos de ejemplo)
        ];
    };
    
    // ⭐ Filtrado por búsqueda
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

    // Función para formatear el horario de un día
    const formatearHorarioDia = (horario) => {
        if (!horario || horario.trim() === '') {
            return <span className={styles.sinClase}>-</span>;
        }

        const [horaInicio, horaFin] = horario.split('-').map(h => h.trim());

        return (
            <div className={styles.horarioDia}>
                <span className={styles.hora}>{horaInicio} - {horaFin}</span>
            </div>
        );
    };

    // ⭐ CONDICIONALES DE RENDERIZADO AL FINAL
    if (authLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Cargando autenticación...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

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
                             <h2>
                                {semestreActual 
                                    ? `Horario del ${semestreActual}° Semestre`
                                    : 'Horario Académico'
                                }
                            </h2>
                        </div>
                       {user && (
                            <div className={styles.usuarioDetails}>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.label}>Estudiante:</span>
                                    <span className={styles.value}>
                                        {user.nombreCompleto || `${user.nombre} ${user.apellido}`}
                                    </span>
                                </div>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.label}>Matrícula:</span>
                                    <span className={styles.value}>{user.id}</span>
                                </div>
                                {user.Carrera && (
                                    <div className={styles.usuarioItem}>
                                        <span className={styles.label}>Carrera:</span>
                                        <span className={styles.value}>{user.Carrera}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    
                    {/* Estadísticas rápidas */}
                    <div className={styles.estadisticasHeader}>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-book"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>
                                    {totalMaterias}</span>
                                <span className={styles.estadisticaLabel}>Materias</span>
                            </div>
                        </div>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-star"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>
                                    {totalCreditos}
                                </span>
                                <span className={styles.estadisticaLabel}>Créditos</span>
                            </div>
                        </div>
                        <div className={styles.estadisticaItem}>
                            <i className="fas fa-calendar-alt"></i>
                            <div>
                                <span className={styles.estadisticaNumero}>
                                    {semestreActual || '-'}°</span>
                                <span className={styles.estadisticaLabel}>Semestre</span>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

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
                    onClick={() => navigate('/inicio')}
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
                                Horario del {semestreActual}° Semestre 
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}