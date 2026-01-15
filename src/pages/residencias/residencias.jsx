import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './residencias.module.css';

// Importar ícono de campana
import campanaIcon from '../../assets/icons/campana.png';
import {supabase} from "../../assets/scripts/serverless/supabaseClient.js";


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Datos de ejemplo - Más residencias para probar
const datosResidenciasEjemplo = [
    {
        id:getRandomInt(1,1000),
        titulo: "Desarrollador Full Stack",
        empresa: "Tech Solutions S.A. de C.V.",
        descripcion: "Desarrollo de aplicaciones web y móviles utilizando tecnologías modernas como React, Node.js y MongoDB. Participarás en proyectos reales con clientes internacionales.",
        requisitos: "Conocimiento en JavaScript, HTML, CSS, Git. Estudiante de últimos semestres de Ingeniería en Sistemas. Inglés intermedio.",
        responsable: {
            titulo: "Ing.",
            nombre: "Ana",
            apellido: "Martínez López"
        },
        contacto: "ana.martinez@techsolutions.com - Tel: 477 123 4567",
        fecha_ini: "2025-02-01",
        fecha_fin: "2025-07-31",
        vacantes: 3,
        disponible: true,
        area: "Desarrollo Web"
    },
    {
        id: getRandomInt(1,1000),
        titulo: "Analista de Datos",
        empresa: "Data Analytics Corp",
        descripcion: "Análisis de grandes volúmenes de datos para la toma de decisiones empresariales. Crearás dashboards y reportes para diferentes departamentos.",
        requisitos: "Conocimientos en SQL, Python, Excel avanzado. Estadística básica. Power BI o Tableau.",
        responsable: {
            titulo: "Ing.",
            nombre: "Carlos",
            apellido: "Rodríguez"
        },
        contacto: "carlos.rodriguez@dataanalytics.com - Tel: 477 987 6543",
        fecha_ini: "2025-01-15",
        fecha_fin: "2025-06-30",
        vacantes: 2,
        disponible: true,
        area: "Data Science"
    },
    {
        id: getRandomInt(1,1000),
        titulo: "Soporte Técnico Especializado",
        empresa: "IT Support Services",
        descripcion: "Brindar soporte técnico a clientes corporativos y resolver incidencias de software y hardware. Trabajarás con tecnología de punta.",
        requisitos: "Conocimientos en redes, sistemas operativos (Windows/Linux), hardware. Certificaciones son una ventaja.",
        responsable: {
            titulo: "Ing.",
            nombre: "Roberto",
            apellido: "Sánchez"
        },
        contacto: "roberto.sanchez@itsupport.com - Tel: 477 555 1234",
        fecha_ini: "2025-03-01",
        fecha_fin: "2025-08-31",
        vacantes: 5,
        disponible: true,
        area: "Soporte IT"
    },
    {
        id: getRandomInt(1,1000),
        titulo: "Diseñador UI/UX",
        empresa: "Creative Digital Solutions",
        descripcion: "Diseño de interfaces y experiencias de usuario para aplicaciones web y móviles. Colaborarás con equipos de desarrollo.",
        requisitos: "Conocimiento en Figma, Adobe XD, principios de diseño. Portfolio requerido. Creatividad y atención al detalle.",
        responsable: {
            titulo: "Diseñadora",
            nombre: "Laura",
            apellido: "Fernández"
        },
        contacto: "laura.fernandez@creativedigital.com - Tel: 477 444 7890",
        fecha_ini: "2025-03-15",
        fecha_fin: "2025-08-15",
        vacantes: 2,
        disponible: true,
        area: "Diseño"
    },
    {
        id: getRandomInt(1,1000),
        titulo: "Administrador de Bases de Datos",
        empresa: "Database Experts S.A.",
        descripcion: "Administración y optimización de bases de datos empresariales. Garantizarás la disponibilidad y seguridad de la información.",
        requisitos: "MySQL, PostgreSQL, SQL Server. Conocimientos en optimización y backup. Experiencia en ambientes productivos.",
        responsable: {
            titulo: "Ing.",
            nombre: "Miguel Ángel",
            apellido: "Torres",
        },
        contacto: "miguel.torres@dbexperts.com - Tel: 477 333 2222",
        fecha_ini: "2025-02-15",
        fecha_fin: "2025-07-15",
        vacantes: 1,
        disponible: false,
        area: "Bases de Datos"
    }
];

export default function Residencias() {
    const navigate = useNavigate();
    const [residencias, setResidencias] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const [userID, setUserID] = useState(-1);

    // Estado del usuario: null = puede solicitar, 'aceptada' = tiene una aceptada
    const [estadoUsuario, setEstadoUsuario] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {

        const setUser = async () =>{
            const {data: id, error: authErr} = await supabase.rpc('get_user_set').single();
            if(!authErr){
                setUserID(id.id_usuario);
            }
        }

        // Cargar residencias
        setResidencias(datosResidenciasEjemplo);

        const verificarNotificaciones = async () => {

            if (userID !== -1) {
                const {data, error} = await supabase
                    .from('notificacion')
                    .select('*')
                    .eq('id_usuario',userID);
                if(!error){
                    setNotificaciones(data);
                }
            }
        }

        const channel = supabase
            .channel(`user-${userID}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notificacion',
                    filter: `id_usuario=eq.${userID}`
                },
                (payload) => {
                    setNotificaciones(payload);
                }
            )
            .subscribe();

        // Verificar si el usuario ya tiene una residencia aceptada
        // En una app real, esto vendría de una API
        const verificarEstadoUsuario = async () => {

            if(userID !== -1){
                // check if user has residencia by querying the DB
                const { data, error } = await supabase
                    .from('residencia')
                    .select('estado')
                    .eq('id_alumno',userID).maybeSingle();

                if(!error){
                    setEstadoUsuario(data);
                }
            }
        };

        setUser().catch(console.error);
        if(userID===-1) return;
        verificarNotificaciones().catch(console.error);
        verificarEstadoUsuario().catch(console.error);

        return () => {
            supabase.removeChannel(channel).catch(console.error);
        };
    }, [userID,notificaciones]);

    // Determinar si el usuario puede solicitar
    const puedeSolicitar = estadoUsuario === null;
    const tieneResidenciaAceptada = estadoUsuario === 'aceptada';

    // Filtrar residencias por búsqueda
    const residenciasFiltradas = residencias.filter(residencia =>
        residencia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        residencia.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
        residencia.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        residencia.area.toLowerCase().includes(busqueda.toLowerCase())
    );

    // FUNCIONES DE NOTIFICACIÓN
    const mostrarExito = (titulo, mensaje) => {
        toast.success(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - ITL
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>{mensaje}</p>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
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

    const mostrarError = (titulo, mensaje) => {
        toast.error(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>
                    <i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - ITL
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>{mensaje}</p>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#ffebee',
                    borderLeft: '5px solid #c62828',
                    color: '#333',
                    maxWidth: '450px',
                }
            }
        );
    };

    const mostrarAdvertencia = (titulo, mensaje) => {
        toast.warning(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#d35400' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    {titulo} - ITL
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>{mensaje}</p>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#fffaf0',
                    borderLeft: '5px solid #d35400',
                    color: '#333',
                    maxWidth: '450px',
                }
            }
        );
    };

    const mostrarInfo = (titulo, mensaje) => {
        toast.info(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#003366' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - ITL
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>{mensaje}</p>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#f0f8ff',
                    borderLeft: '5px solid #003366',
                    color: '#333',
                    maxWidth: '450px',
                },
                bodyStyle: {
                    fontSize: '14px',
                }
            }
        );
    };

    // Función para mostrar notificación de confirmación de solicitud
    const mostrarConfirmacionSolicitud = (residencia) => {
        toast.warning(
            <div>
                <h3 style={{ margin: '0 0 15px 0', color: '#d35400' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    Confirmar Solicitud - ITL
                </h3>
                <p style={{ margin: '0 0 10px 0' }}>
                    ¿Estás seguro de solicitar esta residencia?
                </p>
                <div style={{
                    background: '#fffaf0',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    borderLeft: '4px solid #d35400'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#d35400' }}>
                        <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
                        {residencia.titulo}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                        <i className="fas fa-building" style={{ marginRight: '8px', color: '#666' }}></i>
                        <strong>Empresa:</strong> {residencia.empresa}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                        <i className="fas fa-calendar" style={{ marginRight: '8px', color: '#666' }}></i>
                        <strong>Duración:</strong> {formatearFecha(residencia.fecha_ini)} - {formatearFecha(residencia.fecha_fin)}
                    </p>
                    <p style={{ margin: '0', fontSize: '14px' }}>
                        <i className="fas fa-users" style={{ marginRight: '8px', color: '#666' }}></i>
                        <strong>Vacantes:</strong> {residencia.vacantes}
                    </p>
                </div>
                <div style={{
                    background: '#e8f4fc',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    border: '1px solid #b3e0ff'
                }}>
                    <p style={{ 
                        margin: '0', 
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}>
                        <i className="fas fa-info-circle" style={{ 
                            marginRight: '8px', 
                            color: '#0066cc',
                            marginTop: '2px'
                        }}></i>
                        <span>
                            <strong>Importante:</strong> Esta acción enviará tu solicitud para revisión. 
                            Solo puedes tener una residencia aceptada a la vez.
                        </span>
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '15px'
                }}>
                    <button 
                        onClick={() => {
                            toast.dismiss();
                            procesarSolicitudResidencia(residencia.id, residencia);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 'bold',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        <i className="fas fa-paper-plane"></i>
                        Sí, Solicitar
                    </button>
                    <button 
                        onClick={() => toast.dismiss()}
                        style={{
                            background: 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 'bold',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 6px rgba(117, 117, 117, 0.2)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        <i className="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                style: {
                    background: '#fffaf0',
                    borderLeft: '5px solid #d35400',
                    color: '#333',
                    maxWidth: '500px',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                },
                bodyStyle: {
                    fontSize: '14px',
                }
            }
        );
    };

    // todo
    // Función para procesar la solicitud después de confirmar
    const procesarSolicitudResidencia = async (idResidencia, residencia) => {
        try {
            /*// 1. Guardar la solicitud en localStorage (simulación de API)
            const solicitudNueva = {
                id: new Date(),
                id_residencia: idResidencia,
                titulo: residencia.titulo,
                empresa: residencia.empresa,
                descripcion: residencia.descripcion,
                responsable: residencia.responsable,
                contacto: residencia.contacto,
                fecha_ini: residencia.fecha_ini,
                fecha_fin: residencia.fecha_fin,
                vacantes: residencia.vacantes,
                estado: "Pendiente",
                fecha_solicitud: new Date().toISOString().split('T')[0],
                fecha_respuesta: null,
                area: residencia.area
            };

            // Guardar en localStorage (simulación de base de datos)
            const solicitudesExistentes = JSON.parse(localStorage.getItem('solicitudesUsuario') || '[]');
            solicitudesExistentes.push(solicitudNueva);
            localStorage.setItem('solicitudesUsuario', JSON.stringify(solicitudesExistentes));*/

            // is asesor in table?
            let canInsert = false;
            const {data: asesorData} = await supabase
                .from("asesor")
                .select("*")
                .eq("nombre",residencia.responsable.nombre)
                .eq("apellido",residencia.responsable.apellido)
                .maybeSingle();
            if(!asesorData){
                // add new asesor
                const {error: newAsesorErr } = await supabase.from('asesor').insert([{
                    nombre: residencia.responsable.nombre,
                    apellido: residencia.responsable.apellido,
                    contacto: residencia.contacto
                }]);
                if(!newAsesorErr){
                    canInsert = true;
                }
            }else{
                canInsert = true;
            }


            if(canInsert){
                // make insert into DB
                const { error} = await supabase.from("residencia").insert(
                    [{
                        id_residencia: idResidencia,
                        id_alumno: userID,
                        id_asesor: asesorData.id_asesor,
                        empresa: residencia.empresa,
                        descripcion: residencia.descripcion,
                        vacantes: residencia.vacantes,
                        fecha_inicio: residencia.fecha_ini,
                        fecha_fin: residencia.fecha_fin,
                        estado: "Pendiente"
                    }]
                );
                if(!error){
                    // 2. Remover la residencia de la lista de disponibles
                    setResidencias(prev => prev.filter(r => r.id !== idResidencia));

                    // 3.
                    const { error: notifErr } = await supabase.from("notificacion").insert([{
                        id_notificacion: notificaciones.length + 1,
                        id_usuario: userID,
                        mensaje: `Solicitaste la residencia: ${residencia.titulo} - ${residencia.empresa}`
                    }]);
                    if(!notifErr){
                        // 4. Mostrar notificación de éxito
                        mostrarExito(
                            "¡Solicitud Enviada!",
                            `Tu solicitud para "${residencia.titulo}" ha sido enviada exitosamente. ` +
                            `Recibirás una respuesta por correo electrónico.`
                        );
                        // 5. Mostrar notificación para ver estado
                        setTimeout(() => {
                            toast.info(
                                <div>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>
                                        <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                                        Ver Estado de Solicitud - ITL
                                    </h3>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                                        ¿Deseas ver el estado de todas tus solicitudes?
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}>
                                        <button
                                            onClick={() => {
                                                toast.dismiss();
                                                navigate('/solicitudes');
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                flex: 1,
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '14px',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                        >
                                            <i className="fas fa-external-link-alt"></i>
                                            Ir a Mis Solicitudes
                                        </button>
                                        <button
                                            onClick={() => toast.dismiss()}
                                            style={{
                                                background: 'transparent',
                                                color: '#003366',
                                                border: '2px solid #003366',
                                                padding: '10px 20px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                flex: 1,
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '14px',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = '#003366';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = '#003366';
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                            Más tarde
                                        </button>
                                    </div>
                                </div>,
                                {
                                    position: "top-right",
                                    autoClose: 10000,
                                    closeOnClick: false,
                                    style: {
                                        background: '#f0f8ff',
                                        borderLeft: '5px solid #003366',
                                        color: '#333',
                                        maxWidth: '450px',
                                        borderRadius: '10px'
                                    }
                                }
                            );
                        }, 1500);
                    }else{
                        mostrarError("Error","No se pudo procesar la solicitud.");
                    }
                }else{
                    console.log(error)
                }
            }

            /*// 3. Agregar notificación interna
            const nuevaNotificacion = {
                id: notificaciones.length + 1,
                fecha_env: new Date().toISOString().split('T')[0],
                mensaje: `Solicitaste la residencia: ${residencia.titulo} - ${residencia.empresa}`,
                tipo: 'solicitud'
            };
            setNotificaciones(prev => [nuevaNotificacion, ...prev]);*/

        } catch (error) {
            mostrarError(
                "Error al procesar",
                "Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo."
            );
            console.error("Error:", error);
        }
    };

    // Función para solicitar residencia
    const solicitarResidencia = (idResidencia) => {
        if (!puedeSolicitar) {
            mostrarAdvertencia(
                "Residencia no disponible",
                "Ya tienes una residencia aceptada. No puedes solicitar más residencias."
            );
            return;
        }

        const residenciaSolicitada = residencias.find(r => r.id === idResidencia);
        
        if (!residenciaSolicitada.disponible) {
            mostrarAdvertencia(
                "Residencia no disponible",
                "Esta residencia no está disponible para solicitud en este momento."
            );
            return;
        }

        mostrarConfirmacionSolicitud(residenciaSolicitada);
    };

    // Función para formatear fecha
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Función para limpiar todas las notificaciones
    const limpiarNotificaciones = () => {
        setNotificaciones([]);
        mostrarInfo(
            "Notificaciones limpiadas",
            "Todas las notificaciones han sido eliminadas."
        );
    };

    // Banner informativo cuando hay residencia aceptada
    const BannerResidenciaAceptada = () => {
        if (!tieneResidenciaAceptada) return null;
        
        return (
            <div className={`${styles.bannerEstado} ${styles.bannerAceptada}`}>
                <div className={styles.bannerContent}>
                    <i className="fas fa-check-circle"></i>
                    <div>
                        <h3>¡Tienes una residencia aceptada!</h3>
                        <p>
                            Tu solicitud ha sido aprobada. Revisa el módulo de Solicitudes 
                            para más detalles sobre tu residencia profesional.
                        </p>
                    </div>
                    <button 
                        className={styles.btnIrSolicitudes}
                        onClick={() => {
                            mostrarInfo(
                                "Redirigiendo...",
                                "Serás redirigido al módulo de Solicitudes."
                            );
                            setTimeout(() => navigate('/solicitudes'), 1000);
                        }}
                    >
                        <i className="fas fa-external-link-alt"></i>
                        Ver mi residencia
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Seccion title="RESIDENCIAS PROFESIONALES">
            {/* Contenedor de notificaciones */}
            <ToastContainer
                toastClassName="itl-toast"
                position="top-right"
                autoClose={5000}
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
                {/* Banner si hay residencia aceptada */}

                {BannerResidenciaAceptada()}

                {/* Contenido principal */}
                <main className={styles.contenido}>
                    {/* Contador de residencias */}
                    <div className={styles.residenciasCount}>
                        <div className={styles.countInfo}>
                            <i className="fas fa-building"></i>
                            <span>Residencias disponibles: <strong>{residenciasFiltradas.length}</strong></span>
                        </div>
                        {!puedeSolicitar && (
                            <div className={styles.estadoUsuario}>
                                <i className="fas fa-info-circle"></i>
                                <span>Solo lectura - Tienes una residencia aceptada</span>
                            </div>
                        )}
                    </div>

                    {/* Lista de residencias */}
                    {residenciasFiltradas.length > 0 ? (
                        residenciasFiltradas.map((residencia) => (
                            <div key={residencia.id} className={`${styles.empresaCard} ${!residencia.disponible ? styles.cardNoDisponible : ''}`}>
                                <div className={styles.empresaHeader}>
                                    <div className={styles.headerLeft}>
                                        <strong>{residencia.titulo}</strong>
                                        <span className={styles.areaBadge}>
                                            <i className="fas fa-tag"></i>
                                            {residencia.area}
                                        </span>
                                    </div>
                                    <div className={styles.headerRight}>
                                        {!residencia.disponible ? (
                                            <span className={styles.badgeNoDisponible}>
                                                <i className="fas fa-ban"></i> No disponible
                                            </span>
                                        ) : (
                                            <span className={styles.vacantesBadge}>
                                                <i className="fas fa-users"></i>
                                                {residencia.vacantes} vacante{residencia.vacantes !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.empresaInfo}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoColumn}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-building"></i>
                                                    EMPRESA:
                                                </span>
                                                <span className={styles.infoValue}>{residencia.empresa}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-user-tie"></i>
                                                    RESPONSABLE:
                                                </span>
                                                <span className={styles.infoValue}>{residencia.responsable.titulo
                                                    +" "+residencia.responsable.nombre
                                                    +" "+residencia.responsable.apellido}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-check"></i>
                                                    FECHA INICIO:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(residencia.fecha_ini)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoColumn}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-phone"></i>
                                                    CONTACTO:
                                                </span>
                                                <span className={styles.infoValue}>{residencia.contacto}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-times"></i>
                                                    FECHA FIN:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(residencia.fecha_fin)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.descripcionContainer}>
                                        <span className={styles.infoLabel}>
                                            <i className="fas fa-file-alt"></i>
                                            DESCRIPCIÓN:
                                        </span>
                                        <p className={styles.descripcionText}>{residencia.descripcion}</p>
                                    </div>

                                    <div className={styles.requisitosContainer}>
                                        <span className={styles.infoLabel}>
                                            <i className="fas fa-list-check"></i>
                                            REQUISITOS:
                                        </span>
                                        <p className={styles.requisitosText}>{residencia.requisitos}</p>
                                    </div>

                                    {/* Botón de solicitar */}
                                    <div className={styles.empresaActions}>
                                        {!puedeSolicitar ? (
                                            <button 
                                                className={styles.btnSolicitarDisabled}
                                                disabled
                                                onClick={() => {
                                                    mostrarAdvertencia(
                                                        "Acción no disponible",
                                                        "Ya tienes una residencia aceptada. No puedes solicitar más residencias."
                                                    );
                                                }}
                                            >
                                                <i className="fas fa-lock"></i>
                                                Residencia aceptada
                                            </button>
                                        ) : !residencia.disponible ? (
                                            <button 
                                                className={styles.btnSolicitarDisabled}
                                                disabled
                                            >
                                                <i className="fas fa-ban"></i>
                                                No disponible
                                            </button>
                                        ) : (
                                            <button 
                                                className={styles.btnSolicitar}
                                                onClick={() => solicitarResidencia(residencia.id)}
                                            >
                                                <i className="fas fa-paper-plane"></i>
                                                Solicitar Residencia
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.sinResultados}>
                            {tieneResidenciaAceptada ? (
                                <>
                                    <div className={styles.sinResultadosIcon}>
                                        <i className="fas fa-check-double fa-3x"></i>
                                    </div>
                                    <div className={styles.sinResultadosContent}>
                                        <h3>Ya tienes una residencia aceptada</h3>
                                        <p>
                                            Tu solicitud ha sido aprobada exitosamente. 
                                            Revisa el módulo de Solicitudes para ver todos los detalles 
                                            de tu residencia profesional.
                                        </p>
                                        <button 
                                            className={styles.btnIrSolicitudes}
                                            onClick={() => {
                                                mostrarInfo(
                                                    "Redirigiendo...",
                                                    "Serás redirigido al módulo de Solicitudes."
                                                );
                                                setTimeout(() => navigate('/solicitudes'), 1000);
                                            }}
                                        >
                                            <i className="fas fa-external-link-alt"></i>
                                            Ver mi residencia
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.sinResultadosIcon}>
                                        <i className="fas fa-search fa-3x"></i>
                                    </div>
                                    <div className={styles.sinResultadosContent}>
                                        <h3>No se encontraron residencias</h3>
                                        <p>
                                            No hay residencias disponibles con los criterios de búsqueda actuales. 
                                            Intenta con otros términos o verifica más tarde.
                                        </p>
                                        <button 
                                            className={styles.btnLimpiarBusqueda}
                                            onClick={() => {
                                                setBusqueda('');
                                                mostrarInfo(
                                                    "Búsqueda limpiada",
                                                    "Se mostrarán todas las residencias disponibles."
                                                );
                                            }}
                                        >
                                            <i className="fas fa-undo"></i>
                                            Mostrar todas las residencias
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>

                {/* Barra lateral con búsqueda y notificaciones */}
                <aside className={styles.sidebar}>
                    {/* Barra de búsqueda */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchHeader}>
                            <i className="fas fa-search"></i>
                            <h3>Buscar Residencias</h3>
                        </div>
                        <div className={styles.searchInputContainer}>
                            <input
                                type="text"
                                placeholder="Título, empresa, área..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className={styles.searchInput}
                                disabled={!puedeSolicitar}
                            />
                            {busqueda && (
                                <button 
                                    className={styles.btnLimpiarBusquedaSidebar}
                                    onClick={() => setBusqueda('')}
                                    title="Limpiar búsqueda"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <p className={styles.searchHint}>
                            <i className="fas fa-lightbulb"></i>
                            Busca por título, empresa, área o descripción
                        </p>
                    </div>

                    {/* Enlace a solicitudes - SIEMPRE visible */}
                    <div className={styles.solicitudesContainer}>
                        <button 
                            className={styles.btnSolicitudes}
                            onClick={() => {
                                mostrarInfo(
                                    "Redirigiendo...",
                                    "Serás redirigido al módulo de Solicitudes."
                                );
                                setTimeout(() => navigate('/solicitudes'), 1000);
                            }}
                        >
                            <div className={styles.btnSolicitudesContent}>
                                <div className={styles.btnSolicitudesIcon}>
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <div className={styles.btnSolicitudesText}>
                                    <span className={styles.btnSolicitudesTitle}>Mis Solicitudes</span>
                                    <span className={styles.btnSolicitudesSubtitle}>
                                        Ver estado de mis solicitudes
                                    </span>
                                </div>
                                {!puedeSolicitar && (
                                    <div className={styles.btnSolicitudesBadge}>
                                        <i className="fas fa-check"></i>
                                    </div>
                                )}
                                <div className={styles.btnSolicitudesArrow}>
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Notificaciones */}
                    <div className={styles.campanaContainer}>
                        <button 
                            className={styles.campanaButton}
                            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                            aria-label="Ver notificaciones"
                        >
                            <img 
                                src={campanaIcon} 
                                alt="Notificaciones" 
                                className={styles.campanaIcon}
                            />
                            {notificaciones.length > 0 && (
                                <span className={styles.notificacionBadge}>
                                    {notificaciones.length}
                                </span>
                            )}
                        </button>

                        {/* Panel de notificaciones */}
                        {mostrarNotificaciones && (
                            <div className={styles.notificacionPanel}>
                                <div className={styles.notificacionHeader}>
                                    <h3>
                                        <i className="fas fa-bell"></i>
                                        Tus Notificaciones
                                    </h3>
                                    <div className={styles.notificacionActions}>
                                        {notificaciones.length > 0 && (
                                            <button 
                                                className={styles.btnLimpiarTodas}
                                                onClick={limpiarNotificaciones}
                                                title="Limpiar todas las notificaciones"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        )}
                                        <button 
                                            className={styles.btnCerrarNotificaciones}
                                            onClick={() => setMostrarNotificaciones(false)}
                                            aria-label="Cerrar notificaciones"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.notificacionList}>
                                    {notificaciones.length > 0 ? (
                                        <ul className={styles.listaNotificacion}>
                                            {notificaciones.map((noti) => (
                                                <li key={noti.id_notificacion} className={styles.notificacionItem}>
                                                    <div className={styles.notificacionItemContent}>
                                                        <div className={styles.notiFecha}>
                                                            <i className="fas fa-calendar"></i>
                                                            {formatearFecha(noti.fecha_envio)}
                                                        </div>
                                                        <div className={styles.notiMensaje}>
                                                            <i className="fas fa-envelope"></i>
                                                            {noti.mensaje}
                                                        </div>
                                                    </div>
                                                    <button 
                                                        className={styles.btnEliminarNotificacion}
                                                        onClick={() => {
                                                            setNotificaciones(prev => prev.filter(n => n.id !== noti.id));
                                                            mostrarInfo(
                                                                "Notificación eliminada",
                                                                "La notificación ha sido eliminada."
                                                            );
                                                        }}
                                                        title="Eliminar notificación"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className={styles.sinNotificaciones}>
                                            <i className="fas fa-bell-slash fa-2x"></i>
                                            <p>No tienes notificaciones nuevas</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.notificacionFooter}>
                                    <button 
                                        className={styles.btnVerTodas}
                                        onClick={() => {
                                            mostrarInfo(
                                                "Historial completo",
                                                "Aquí se mostraría el historial completo de notificaciones."
                                            );
                                        }}
                                    >
                                        <i className="fas fa-history"></i>
                                        Ver historial completo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className={styles.estadisticasContainer}>
                        <div className={styles.estadisticasHeader}>
                            <i className="fas fa-chart-bar"></i>
                            <h3>Estadísticas</h3>
                        </div>
                        <div className={styles.estadisticasContent}>
                            <div className={styles.estadisticaItem}>
                                <span className={styles.estadisticaLabel}>Disponibles:</span>
                                <span className={styles.estadisticaValor}>{residencias.filter(r => r.disponible).length}</span>
                            </div>
                            <div className={styles.estadisticaItem}>
                                <span className={styles.estadisticaLabel}>Áreas:</span>
                                <span className={styles.estadisticaValor}>4</span>
                            </div>
                            <div className={styles.estadisticaItem}>
                                <span className={styles.estadisticaLabel}>Vacantes:</span>
                                <span className={styles.estadisticaValor}>
                                    {residencias.reduce((total, r) => total + r.vacantes, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerInfo}>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-university"></i>
                                    Departamento de Vinculación
                                </h4>
                                <p>Residencias Profesionales</p>
                                <p>Tecnológico Nacional de México Campus León</p>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-envelope"></i>
                                    Contacto
                                </h4>
                                <p>residencias@leon.tecnm.mx</p>
                                <p>Tel: 477 710 0000 Ext. 1234</p>
                            </div>
                            <div className={styles.footerSection}>
                                <h4>
                                    <i className="fas fa-clock"></i>
                                    Horario de atención
                                </h4>
                                <p>Lunes a Viernes: 9:00 - 17:00 hrs</p>
                                <p>Sábados: 9:00 - 13:00 hrs</p>
                            </div>
                        </div>
                        <div className={styles.footerDerechos}>
                            <p className={styles.derechos}>
                                © 2025 TecNM León. Departamento de Vinculación y Residencias Profesionales.
                            </p>
                            <p className={styles.infoAdicional}>
                                Para más información contacta al departamento: residencias@leon.tecnm.mx | Tel: 477 710 0000
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}