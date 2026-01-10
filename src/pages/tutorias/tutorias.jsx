import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styles from './tutorias.module.css';
import logoFondo from '../../assets/backgrounds/LogoTecNMVertical_Blanco-150x150(1).png';
import Seccion from "../../assets/templates/seccion/seccion.jsx";

export default function Tutorias() {
    const navigate = useNavigate();

    // Datos de los grupos de tutoría
    const gruposTutoria = [
        {
            id: 1,
            materia: 'CÁLCULO DIFERENCIAL',
            espacios: 4,
            horario: 'Lun a Viernes, 10:30 - 11:30 AM',
            lugar: 'Sala Alfombrada',
            tutor: 'José Gutiérrez',
            alumnosInscritos: 17,
            tipoTutor: 'Alumno',
            horas: '1 Hora de clase',
            dias: 'Lun a Viernes'
        },
        {
            id: 2,
            materia: 'INVESTIGACIÓN DE OPERACIONES',
            espacios: 10,
            horario: 'Martes y Jueves, 12:15 - 2:15 PM',
            lugar: 'Salón D6',
            tutor: 'Ana Frausto González',
            alumnosInscritos: 8,
            tipoTutor: 'Alumna',
            horas: '2 Horas de clase',
            dias: 'Martes y Jueves'
        },
        {
            id: 3,
            materia: 'PROGRAMACIÓN ORIENTADA A OBJ.',
            espacios: 2,
            horario: 'Lunes y Viernes, 10:30 - 2:30 PM',
            lugar: 'Salón E6',
            tutor: 'Fabricio Becerra Quezada',
            alumnosInscritos: 12,
            tipoTutor: 'Alumno',
            horas: '4 Horas de clase',
            dias: 'Lunes y Viernes'
        },
        // Puedes añadir más grupos aquí
        {
            id: 4,
            materia: 'ESTRUCTURA DE DATOS',
            espacios: 6,
            horario: 'Miércoles, 9:00 - 11:00 AM',
            lugar: 'Laboratorio A3',
            tutor: 'Carlos Méndez López',
            alumnosInscritos: 15,
            tipoTutor: 'Alumno',
            horas: '2 Horas de clase',
            dias: 'Miércoles'
        },
        {
            id: 5,
            materia: 'BASE DE DATOS',
            espacios: 3,
            horario: 'Lunes y Miércoles, 4:00 - 6:00 PM',
            lugar: 'Salón F8',
            tutor: 'María Fernández Ruiz',
            alumnosInscritos: 20,
            tipoTutor: 'Alumna',
            horas: '2 Horas de clase',
            dias: 'Lunes y Miércoles'
        },
        {
            id: 6,
            materia: 'PROGRAMACIÓN WEB',
            espacios: 8,
            horario: 'Jueves, 2:00 - 5:00 PM',
            lugar: 'Laboratorio B2',
            tutor: 'Roberto Sánchez Torres',
            alumnosInscritos: 10,
            tipoTutor: 'Alumno',
            horas: '3 Horas de clase',
            dias: 'Jueves'
        }
    ];

    // Función para obtener el color de los espacios
    const getColorEspacios = (espacios) => {
        if (espacios <= 3) return styles.espaciosCriticos;
        if (espacios <= 6) return styles.espaciosLimitados;
        return styles.espaciosDisponibles;
    };

    const mostrarAclaraciones = () => {
        toast.info(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#003366' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    Aclaraciones - ITL
                </h3>
                <p style={{ margin: '0' }}>
                    No dudes en enviar tus aclaraciones por medio de reportes en esta misma página
                </p>
                <p style={{ margin: '10px 0 0 0' }}>
                    <strong>Extensión:</strong> 477 658 1243<br/>
                    <strong>Horario:</strong> 9:00 AM a 3:00 PM<br/>
                    <strong>Días:</strong> Lunes a Viernes
                </p>
            </div>,
            {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#f0f8ff',
                    borderLeft: '5px solid #003366',
                    color: '#333',
                },
                bodyStyle: {
                    fontSize: '14px',
                }
            }
        );
    };

    // Función para mostrar notificación de preguntas
    const mostrarPreguntas = () => {
        toast.warning(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#d35400' }}>
                    <i className="fas fa-question-circle" style={{ marginRight: '8px' }}></i>
                    Preguntas - ITL
                </h3>
                <p style={{ margin: '0' }}>
                    ¿Tienes preguntas? Contáctanos:
                </p>
                <p style={{ margin: '10px 0 0 0' }}>
                    <strong>Extensión:</strong> 477 658 1243<br/>
                    <strong>Horario:</strong> 9:00 AM a 3:00 PM<br/>
                    <strong>Días:</strong> Lunes a Viernes
                </p>
            </div>,
            {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#fffaf0',
                    borderLeft: '5px solid #d35400',
                    color: '#333',
                }
            }
        );
    };
     const mostrarInscripcionExitosa = (materia, tutor) => {
        toast.success(
            <div>
                <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                    ¡Inscripción Exitosa! - ITL
                </h3>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                    Has sido inscrito a: <span style={{ color: '#2e7d32' }}>{materia}</span>
                </p>
                <p style={{ margin: '0 0 10px 0' }}>
                    <strong>Tutor:</strong> {tutor}
                </p>
                <div style={{
                    background: '#f1f8e9',
                    padding: '10px',
                    borderRadius: '6px',
                    marginTop: '10px',
                    borderLeft: '3px solid #81c784'
                }}>
                    <p style={{ margin: '0', fontSize: '13px' }}>
                        <i className="fas fa-envelope" style={{ marginRight: '5px', color: '#2e7d32' }}></i>
                        <strong>Importante:</strong> Todo ha ido bien con su inscripción. 
                        Por favor esté pendiente de su correo institucional. 
                        En un periodo de 24 horas recibirá un correo por parte de 
                        Servicios Académicos para darle a conocer el estado de su inscripción.
                    </p>
                </div>
                <p style={{ 
                    margin: '10px 0 0 0', 
                    fontSize: '12px', 
                    fontStyle: 'italic',
                    color: '#666'
                }}>
                    <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                    Por favor, este al pendiente de su bandeja de entrada.
                </p>
            </div>,
            {
                position: "top-right",
                autoClose: 10000, // 10 segundos
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#f1f8e9',
                    borderLeft: '5px solid #2e7d32',
                    color: '#333',
                    maxWidth: '450px',
                },
                bodyStyle: {
                    fontSize: '14px',
                }
            }
        );
    };
    // Función para mostrar notificación de sin cupo
    const mostrarSinCupo = (materia) => {
        toast.error(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>
                    <i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>
                    Sin Cupo Disponible - ITL
                </h3>
                <p style={{ margin: '0 0 10px 0' }}>
                    Lo sentimos, no hay espacios disponibles para:
                </p>
                <p style={{ 
                    margin: '0', 
                    fontWeight: 'bold',
                    color: '#c62828'
                }}>
                    {materia}
                </p>
                <p style={{ 
                    margin: '10px 0 0 0', 
                    fontSize: '13px',
                    fontStyle: 'italic'
                }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
                    Te recomendamos revisar otros grupos de tutoría disponibles.
                </p>
            </div>,
            {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#ffebee',
                    borderLeft: '5px solid #c62828',
                    color: '#333',
                }
            }
        );
    };

    return (
    
        <Seccion title="tutorias">
            {/* Contenedor de notificaciones*/}
            <ToastContainer
                toastClassName="itl-toast"
                position="top-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className={styles.pageContainer}>
                {/* Fondo de marca de agua */}
                <div 
                    className={styles.fondoMarcaAgua}
                    style={{ backgroundImage: `url(${logoFondo})` }}
                ></div>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.logo}>Tecnológico Nacional de León</div>
                    <nav className={styles.nav}>
                        <button 
                            onClick={mostrarAclaraciones}  
                            className={styles.navButton}
                        >
                            ACLARACIONES
                        </button>
                        <button 
                            onClick={mostrarPreguntas} 
                            className={styles.navButton}
                        >
                            <b>PREGUNTAS</b>
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className={styles.navHomeButton}
                            aria-label="Regresar al inicio"
                        >
                            <i className="fas fa-house-chimney"></i>
                        </button>
                    </nav>
                </header>

                {/* Contenido principal */}
                <main className={styles.main}>
                    <h1 className={styles.tituloPrincipal}>
                        GRUPOS DE TUTORÍA <span className={styles.periodo}>ENERO–JUNIO 2025</span>
                    </h1>

                    {/* Tarjetas de tutorías */}
                    <div className={styles.cardsContainer}>
                        {gruposTutoria.map((grupo) => (
                            <div key={grupo.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>{grupo.materia}</h2>
                                    <span className={`${styles.espacios} ${getColorEspacios(grupo.espacios)}`}>
                                        {grupo.espacios} espacio{grupo.espacios !== 1 ? 's' : ''} disponible{grupo.espacios !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                
                                <ul className={styles.cardList}>
                                    <li>
                                        <i className="fas fa-clock"></i>
                                        <strong>{grupo.horas}</strong> de {grupo.dias}
                                    </li>
                                    <li>
                                        <i className="fas fa-calendar-alt"></i>
                                        {grupo.horario}
                                    </li>
                                    <li>
                                        <i className="fas fa-map-marker-alt"></i>
                                        {grupo.lugar}
                                    </li>
                                    <li>
                                        <i className="fas fa-chalkboard-teacher"></i>
                                        Impartido por {grupo.tipoTutor} <strong>{grupo.tutor}</strong>
                                    </li>
                                    <li>
                                        <i className="fas fa-users"></i>
                                        {grupo.alumnosInscritos} alumno{grupo.alumnosInscritos !== 1 ? 's' : ''} inscrito{grupo.alumnosInscritos !== 1 ? 's' : ''}
                                    </li>
                                </ul>

                                {/* Botón de inscripción */}
                                <button 
                                    className={styles.botonInscripcion}
                                    onClick={() => {
                                        if (grupo.espacios > 0) {
                                            mostrarInscripcionExitosa(grupo.materia, grupo.tutor);
                                        } else {
                                            mostrarSinCupo(grupo.materia);
                                        }
                                    }}
                                    disabled={grupo.espacios === 0}
                                >
                                    {grupo.espacios > 0 ? 'INSCRIBIRME' : 'SIN CUPO'}
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Información adicional */}
                    <div className={styles.infoAdicional}>
                        <div className={styles.infoBox}>
                            <i className="fas fa-info-circle"></i>
                            <h3>Importante</h3>
                            <p>Las tutorías son gratuitas y están disponibles para todos los estudiantes.</p>
                        </div>
                        <div className={styles.infoBox}>
                            <i className="fas fa-calendar-check"></i>
                            <h3>Horarios Flexibles</h3>
                            <p>Puedes asistir a múltiples tutorías según tu disponibilidad.</p>
                        </div>
                        <div className={styles.infoBox}>
                            <i className="fas fa-question-circle"></i>
                            <h3>¿Dudas?</h3>
                            <p>Contacta al departamento académico para más información.</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <p className={styles.contacto}>
                            <i className="fas fa-envelope"></i> www.mech@gmail.com
                            <span className={styles.separador}>|</span>
                            <i className="fas fa-phone"></i> +52-656-7890
                        </p>
                        <p className={styles.derechos}>
                            © 2025 TecNM León. Todos los derechos reservados.
                        </p>
                    </div>
                </footer>
            </div>
        </Seccion>
        );
    }
