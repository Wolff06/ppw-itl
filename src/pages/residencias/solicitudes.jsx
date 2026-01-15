import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './solicitudes.module.css';
import {supabase} from "../../assets/scripts/serverless/supabaseClient.js";

export default function Solicitudes() {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        aceptadas: 0,
        pendientes: 0,
        rechazadas: 0
    });

    // Estado de la solicitud aceptada (si existe)
    const [solicitudAceptada, setSolicitudAceptada] = useState(null);

    const [userID, setUserID] = useState(-1);

    const cargarDatosIniciales = () => {
        // Datos iniciales - simulan lo que vendría de la base de datos
        const datosIniciales = [
            {
                id: 1,
                id_residencia: 101,
                titulo: "Desarrollador Full Stack",
                empresa: "Tech Solutions S.A. de C.V.",
                descripcion: "Desarrollo de aplicaciones web y móviles utilizando tecnologías modernas como React, Node.js y MongoDB.",
                requisitos: "Conocimiento en JavaScript, HTML, CSS, Git. Estudiante de últimos semestres de Ingeniería en Sistemas.",
                responsable: "Ing. Ana Martínez López",
                contacto: "ana.martinez@techsolutions.com - Tel: 477 123 4567",
                fecha_ini: "2025-02-01",
                fecha_fin: "2025-07-31",
                vacantes: 3,
                estado: "Pendiente", // Inicialmente todas están pendientes
                fecha_solicitud: new Date().toISOString().split('T')[0],
                fecha_respuesta: null,
                area: "Desarrollo Web",
                motivo_rechazo: null,
                puedeCancelar: true // El usuario puede cancelar solo si está pendiente
            },
            {
                id: 2,
                id_residencia: 102,
                titulo: "Analista de Datos",
                empresa: "Data Analytics Corp",
                descripcion: "Análisis de grandes volúmenes de datos para la toma de decisiones empresariales.",
                requisitos: "Conocimientos en SQL, Python, Excel avanzado. Estadística básica.",
                responsable: "Lic. Carlos Rodríguez",
                contacto: "carlos.rodriguez@dataanalytics.com - Tel: 477 987 6543",
                fecha_ini: "2025-01-15",
                fecha_fin: "2025-06-30",
                vacantes: 2,
                estado: "Pendiente",
                fecha_solicitud: new Date().toISOString().split('T')[0],
                fecha_respuesta: null,
                area: "Data Science",
                motivo_rechazo: null,
                puedeCancelar: true
            }
        ];

        // Guardar en "BD" (localStorage)
        localStorage.setItem('solicitudesUsuarioBD', JSON.stringify(datosIniciales));
        procesarSolicitudes(datosIniciales);
    };

    const procesarSolicitudes = (solicitudesData) => {
        setSolicitudes(solicitudesData);

        // Encontrar solicitud aceptada (si existe)
        const aceptada = solicitudesData.find(s => s.estado === "Aceptado");
        setSolicitudAceptada(aceptada || null);

        // Calcular estadísticas
        const aceptadas = solicitudesData.filter(s => s.estado === "Aceptado").length;
        const pendientes = solicitudesData.filter(s => s.estado === "Pendiente").length;
        const rechazadas = solicitudesData.filter(s => s.estado === "Rechazado").length;

        setEstadisticas({ aceptadas, pendientes, rechazadas });

        /*// Actualizar estado en residencias si hay una aceptada
        if (aceptada) {
            localStorage.setItem('estadoResidenciaUsuario', 'aceptada');
        }*/
    };

    // Función para formatear fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "En espera";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Función para obtener clase CSS según estado
    const getClaseEstado = (estado) => {
        switch (estado) {
            case "Aceptado":
                return styles.estadoAceptado;
            case "Pendiente":
                return styles.estadoPendiente;
            case "Rechazado":
                return styles.estadoRechazado;
            default:
                return styles.estadoPendiente;
        }
    };

    const cargarSolicitudesDesdeBD = () => {
        try {
            // Primero intentar cargar de localStorage (simulación de BD)
            const solicitudesBD = JSON.parse(localStorage.getItem('solicitudesUsuarioBD') || '[]');

            if (solicitudesBD.length > 0) {
                procesarSolicitudes(solicitudesBD);
            } else {
                // Si no hay en "BD", usar datos iniciales de ejemplo
                cargarDatosIniciales();
            }
        } catch (error) {
            console.error("Error cargando solicitudes:", error);
            cargarDatosIniciales();
        }
    };

    // Simular carga de solicitudes desde "base de datos"
    useEffect(() => {

        const setUser = async () =>{
            const {data: id, error: authErr} = await supabase.rpc('get_user_set').single();
            if(!authErr){
                setUserID(id.id_usuario);
            }
        }

        const cargarSolicitudes = async () => {
            const {data, error} = await supabase
                .from("residencia")
                .select("*")
                .eq("id_alumno",userID);
            if(!error){
                if(data.length>0){
                    procesarSolicitudes(data);
                }
            }
        }
        
        /*// Simular actualizaciones periódicas (como si vinieran de la base de datos)
        const intervalo = setInterval(() => {
            cargarSolicitudesDesdeBD();
        }, 30000); // Cada 30 segundos verifica actualizaciones
        
        return () => clearInterval(intervalo);*/

        setUser().catch(console.error);
        if(userID===-1){ return; }
        cargarSolicitudes().catch(console.error);

    }, [userID]);

    // ================== FUNCIONES DE NOTIFICACIÓN ==================

    const mostrarExito = (titulo, mensaje) => {
        toast.success(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - TecNM León
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
                }
            }
        );
    };

    const mostrarError = (titulo, mensaje) => {
        toast.error(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>
                    <i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - TecNM León
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
                }
            }
        );
    };

    const mostrarAdvertencia = (titulo, mensaje) => {
        toast.warning(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#d35400' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    {titulo} - TecNM León
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
                }
            }
        );
    };

    const mostrarInfo = (titulo, mensaje) => {
        toast.info(
            <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#003366' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    {titulo} - TecNM León
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
                }
            }
        );
    };

    // Función para simular que el administrador ha actualizado el estado
    // (En realidad esto sería una notificación push desde el servidor)
    const simularActualizacionAdministrador = async () => {
        if(solicitudAceptada) return;

        const actualizacionesPosibles = [
            {
                id: 1,
                nuevoEstado: "Aceptado",
                mensaje: "¡Tu solicitud ha sido aceptada por el administrador!",
                motivo: null
            },
            {
                id: 2,
                nuevoEstado: "Rechazado",
                mensaje: "Tu solicitud ha sido rechazada por el administrador.",
                motivo: "No cumples con los requisitos mínimos para esta residencia."
            },
            {
                id: null, // Para simular que no hay cambios
                nuevoEstado: null
            }
        ];
        
        // Seleccionar una actualización aleatoria (simula notificación del admin)
        const actualizacion = actualizacionesPosibles[Math.floor(Math.random() * actualizacionesPosibles.length)];
        
        if (actualizacion.id && actualizacion.nuevoEstado) {
            // get random solicitud
            const randomS = solicitudes[Math.floor(Math.random() * solicitudes.length)];
            console.log(randomS.id_residencia);
            // apply new state
            // Mostrar notificación de la actualización
            let found = false;
            if (actualizacion.nuevoEstado === "Aceptado") {
                mostrarExito("Residencia Aceptada", actualizacion.mensaje);
                setSolicitudes(prev=>prev.map(item=>
                    {
                        if(item.id_residencia===randomS.id_residencia){
                            item.estado = "Aceptado";
                            console.log(item);
                            return item;
                        }
                        return item;
                    }
                ));
                // Si es aceptada, rechazar automáticamente las demás
                found = true;
            } else {
                mostrarAdvertencia("Residencia Rechazada", actualizacion.mensaje);
                setSolicitudes(prev=>prev.map(item=>
                    {
                        if(item.id_residencia===randomS.id_residencia){
                            item.estado = "Rechazado";
                            console.log(item);
                            return item;
                        }
                        return item;
                    }
                ));
            }
            console.log("prev: ",solicitudes);
            const nuevasSolicitudes = solicitudes.map(s => {
                if(s.estado !== "Pendiente" || s.id_residencia === randomS.id_residencia) {
                    return s;
                }
                
                // Si se aceptó una, rechazar automáticamente las demás pendientes
                if (found) {
                    s.estado = "Rechazado";
                }
                
                return s;
            });
            
            // Guardar en "BD"
            //localStorage.setItem('solicitudesUsuarioBD', JSON.stringify(nuevasSolicitudes));
            //procesarSolicitudes(nuevasSolicitudes);
            console.log(nuevasSolicitudes);
            const {error} = await supabase.from("residencia").upsert(nuevasSolicitudes,{
                onConflict: 'id_residencia'
            }).select();
            if(error){
               mostrarError("Error","Error desconocido");
               return;
            }
            // Disparar evento para que residencias.jsx se actualice
            //window.dispatchEvent(new Event('storage'));
            window.location.reload();
        }
    };

    // Función para cancelar solicitud pendiente (EL USUARIO SÍ PUEDE HACER ESTO)
    const cancelarSolicitud = (idSolicitud) => {
        const solicitud = solicitudes.find(s => s.id === idSolicitud);
        
        if (!solicitud) return;
        
        if (solicitud.estado !== "Pendiente") {
            mostrarAdvertencia(
                "No se puede cancelar",
                "Solo puedes cancelar solicitudes que están pendientes de revisión."
            );
            return;
        }

        // Mostrar notificación de confirmación
        toast.warning(
            <div>
                <h3 style={{ margin: '0 0 15px 0', color: '#d35400' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    Cancelar Solicitud - TecNM León
                </h3>
                <p style={{ margin: '0 0 10px 0' }}>
                    ¿Estás seguro de cancelar esta solicitud?
                </p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                    {solicitud.titulo} - {solicitud.empresa}
                </p>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                    Esta acción notificará al administrador y no se puede deshacer.
                </p>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '15px'
                }}>
                    <button 
                        onClick={() => {
                            toast.dismiss();
                            procesarCancelacion(idSolicitud, solicitud).catch(console.error);
                        }}
                        style={{
                            background: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 'bold',
                            fontSize: '15px',
                            display: 'flex',
                            alignItem: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-trash"></i>
                        Sí, Cancelar
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
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-times"></i>
                        Conservar
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
                    maxWidth: '400px',
                    borderRadius: '10px'
                }
            }
        );
    };

    const procesarCancelacion = async (idSolicitud, solicitud) => {
        if(userID===-1) return;

        /*// Eliminar la solicitud de la lista
        const nuevasSolicitudes = solicitudes.filter(s => s.id !== idSolicitud);
        // todo
        // Guardar en "BD"
        localStorage.setItem('solicitudesUsuarioBD', JSON.stringify(nuevasSolicitudes));
        procesarSolicitudes(nuevasSolicitudes);*/

        const { error: err} = await supabase
            .from("residencias")
            .delete()
            .eq("id_residencia",idSolicitud);
        if(!err){
            // Mostrar notificación
            mostrarExito(
                "Solicitud Cancelada",
                `Has cancelado la solicitud para: "${solicitud.titulo}". ` +
                `El administrador ha sido notificado.`
            );
        }else{
            mostrarError("Error","No se pudo cancelar la solicitud.");
        }

        // En una app real, aquí se enviaría una notificación al administrador
        console.log(`Notificación al admin: Solicitud ${idSolicitud} cancelada por el usuario`);
    };

    // Función para simular la llegada de una notificación del administrador
    // (Esto sería reemplazado por WebSockets o polling en una app real)
    const verificarNotificacionesAdmin = () => {
        mostrarInfo(
            "Verificando actualizaciones",
            "Buscando actualizaciones del administrador..."
        );
        
        setTimeout(() => {
            simularActualizacionAdministrador().catch(console.error);
        }, 1500);
    };

    // Obtener solicitudes por estado
    const solicitudesPendientes = solicitudes.filter(s => s.estado === "Pendiente");
    const solicitudesAceptadas = solicitudes.filter(s => s.estado === "Aceptado");
    const solicitudesRechazadas = solicitudes.filter(s => s.estado === "Rechazado");

    return (
        <Seccion title="MIS SOLICITUDES">
            {/* Contenedor de notificaciones */}
            <ToastContainer
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
                {/* Banner informativo si hay residencia aceptada */}
                {solicitudAceptada && (
                    <div className={`${styles.bannerEstado} ${styles.bannerAceptada}`}>
                        <div className={styles.bannerContent}>
                            <i className="fas fa-check-circle"></i>
                            <div>
                                <h3>¡Tienes una residencia aceptada!</h3>
                                <p>
                                    {solicitudAceptada.titulo} - {solicitudAceptada.empresa}
                                    <br />
                                    El administrador ha aprobado tu solicitud. Contacta a la empresa para los siguientes pasos.
                                </p>
                            </div>
                            <button 
                                className={styles.btnNotificarAdmin}
                                onClick={verificarNotificacionesAdmin}
                                title="Verificar si hay más actualizaciones"
                            >
                                <i className="fas fa-sync-alt"></i>
                                Actualizar
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenido principal */}
                <main className={styles.contenido}>
                    {/* Contenedor de estadísticas */}
                    <div className={styles.contenedorEstadisticas}>
                        <div className={styles.estadisticaCard}>
                            <div className={`${styles.estadisticaIcon} ${styles.iconAceptadas}`}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className={styles.estadisticaContent}>
                                <h3>Aceptadas</h3>
                                <p className={styles.estadisticaNumero}>{estadisticas.aceptadas}</p>
                                <p className={styles.estadisticaSubtexto}>Por administrador</p>
                            </div>
                        </div>
                        
                        <div className={styles.estadisticaCard}>
                            <div className={`${styles.estadisticaIcon} ${styles.iconPendientes}`}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className={styles.estadisticaContent}>
                                <h3>Pendientes</h3>
                                <p className={styles.estadisticaNumero}>{estadisticas.pendientes}</p>
                                <p className={styles.estadisticaSubtexto}>En revisión</p>
                            </div>
                        </div>
                        
                        <div className={styles.estadisticaCard}>
                            <div className={`${styles.estadisticaIcon} ${styles.iconRechazadas}`}>
                                <i className="fas fa-times-circle"></i>
                            </div>
                            <div className={styles.estadisticaContent}>
                                <h3>Rechazadas</h3>
                                <p className={styles.estadisticaNumero}>{estadisticas.rechazadas}</p>
                                <p className={styles.estadisticaSubtexto}>Por administrador</p>
                            </div>
                        </div>
                    </div>

                    {/* Botón para simular verificación de actualizaciones */}
                    <div className={styles.botonActualizaciones}>
                        <button 
                            className={styles.btnActualizar}
                            onClick={verificarNotificacionesAdmin}
                        >
                            <i className="fas fa-sync-alt"></i>
                            Verificar actualizaciones del administrador
                        </button>
                        <p className={styles.notaActualizaciones}>
                            <i className="fas fa-info-circle"></i>
                            Las actualizaciones se verifican automáticamente cada 30 segundos
                        </p>
                    </div>

                    {/* Mostrar solicitud aceptada primero */}
                    {solicitudAceptada && (
                        <div className={styles.solicitudDestacada}>
                            <h2 className={styles.tituloDestacado}>
                                <i className="fas fa-star"></i>
                                Residencia Aceptada por Administrador
                            </h2>
                            
                            <div className={`${styles.empresaCard} ${styles.cardAceptada}`}>
                                <div className={styles.empresaHeader}>
                                    <div className={styles.headerLeft}>
                                        <strong>{solicitudAceptada.titulo}</strong>
                                        <span className={styles.areaBadge}>
                                            <i className="fas fa-tag"></i>
                                            {solicitudAceptada.area || "General"}
                                        </span>
                                    </div>
                                    <div className={styles.headerRight}>
                                        <span className={`${styles.estadoBadge} ${getClaseEstado(solicitudAceptada.estado)}`}>
                                            <i className="fas fa-user-check"></i>
                                            {solicitudAceptada.estado} por Admin
                                        </span>
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
                                                <span className={styles.infoValue}>{solicitudAceptada.empresa}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-user-tie"></i>
                                                    RESPONSABLE:
                                                </span>
                                                <span className={styles.infoValue}>{solicitudAceptada.responsable}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-check"></i>
                                                    FECHA INICIO:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitudAceptada.fecha_ini)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoColumn}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-phone"></i>
                                                    CONTACTO:
                                                </span>
                                                <span className={styles.infoValue}>{solicitudAceptada.contacto}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-times"></i>
                                                    FECHA FIN:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitudAceptada.fecha_fin)}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-alt"></i>
                                                    FECHA ACEPTACIÓN:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitudAceptada.fecha_respuesta)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.descripcionContainer}>
                                        <span className={styles.infoLabel}>
                                            <i className="fas fa-file-alt"></i>
                                            DESCRIPCIÓN:
                                        </span>
                                        <p className={styles.descripcionText}>{solicitudAceptada.descripcion}</p>
                                    </div>

                                    <div className={styles.requisitosContainer}>
                                        <span className={styles.infoLabel}>
                                            <i className="fas fa-list-check"></i>
                                            REQUISITOS:
                                        </span>
                                        <p className={styles.requisitosText}>{solicitudAceptada.requisitos}</p>
                                    </div>

                                    <div className={styles.notaAceptada}>
                                        <i className="fas fa-user-shield"></i>
                                        <div>
                                            <h4>Aceptado por el Administrador</h4>
                                            <p>
                                                Tu residencia ha sido aprobada. Ya no puedes solicitar otras residencias.
                                                Por favor, contacta a la empresa para coordinar tu inicio.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mostrar solicitudes pendientes */}
                    {solicitudesPendientes.length > 0 && (
                        <div className={styles.seccionPendientes}>
                            <h3 className={styles.tituloSeccion}>
                                <i className="fas fa-clock"></i>
                                Solicitudes Pendientes de Revisión ({solicitudesPendientes.length})
                            </h3>
                            
                            {solicitudesPendientes.map((solicitud) => (
                                <div key={solicitud.id} className={`${styles.empresaCard} ${styles.cardPendiente}`}>
                                    <div className={styles.empresaHeader}>
                                        <div className={styles.headerLeft}>
                                            <strong>{solicitud.titulo}</strong>
                                            <span className={styles.areaBadge}>
                                                <i className="fas fa-tag"></i>
                                                {solicitud.area || "General"}
                                            </span>
                                        </div>
                                        <div className={styles.headerRight}>
                                            <span className={`${styles.estadoBadge} ${getClaseEstado(solicitud.estado)}`}>
                                                <i className="fas fa-user-clock"></i>
                                                Pendiente de Admin
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.empresaInfo}>
                                        <div className={styles.infoResumen}>
                                            <div className={styles.infoResumenItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-building"></i>
                                                    Empresa:
                                                </span>
                                                <span className={styles.infoValue}>{solicitud.empresa}</span>
                                            </div>
                                            <div className={styles.infoResumenItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-alt"></i>
                                                    Solicitud enviada:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitud.fecha_solicitud)}</span>
                                            </div>
                                        </div>

                                        <div className={styles.notaPendiente}>
                                            <i className="fas fa-info-circle"></i>
                                            <p>
                                                Tu solicitud está siendo revisada por el administrador. 
                                                Recibirás una notificación cuando haya una respuesta.
                                            </p>
                                        </div>

                                        <div className={styles.empresaActions}>
                                            <button 
                                                className={styles.btnCancelar}
                                                onClick={() => cancelarSolicitud(solicitud.id)}
                                                disabled={!solicitud.puedeCancelar}
                                            >
                                                <i className="fas fa-times"></i>
                                                Cancelar Solicitud
                                            </button>
                                            <p className={styles.notaAccion}>
                                                <i className="fas fa-user-shield"></i>
                                                Solo el administrador puede aceptar o rechazar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mostrar historial de solicitudes rechazadas */}
                    {solicitudesRechazadas.length > 0 && (
                        <div className={styles.historialSolicitudes}>
                            <h3 className={styles.tituloSeccion}>
                                <i className="fas fa-history"></i>
                                Historial de Solicitudes ({solicitudesRechazadas.length})
                            </h3>
                            
                            {solicitudesRechazadas.map((solicitud) => (
                                <div key={solicitud.id} className={`${styles.empresaCard} ${styles.cardHistorial}`}>
                                    <div className={styles.empresaHeader}>
                                        <div className={styles.headerLeft}>
                                            <strong>{solicitud.titulo}</strong>
                                            <span className={styles.areaBadge}>
                                                <i className="fas fa-tag"></i>
                                                {solicitud.area || "General"}
                                            </span>
                                        </div>
                                        <div className={styles.headerRight}>
                                            <span className={`${styles.estadoBadge} ${getClaseEstado(solicitud.estado)}`}>
                                                <i className="fas fa-user-times"></i>
                                                {solicitud.estado} por Admin
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.empresaInfo}>
                                        <div className={styles.infoResumen}>
                                            <div className={styles.infoResumenItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-building"></i>
                                                    Empresa:
                                                </span>
                                                <span className={styles.infoValue}>{solicitud.empresa}</span>
                                            </div>
                                            <div className={styles.infoResumenItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-alt"></i>
                                                    Solicitud:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitud.fecha_solicitud)}</span>
                                            </div>
                                            <div className={styles.infoResumenItem}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-calendar-check"></i>
                                                    Respuesta:
                                                </span>
                                                <span className={styles.infoValue}>{formatearFecha(solicitud.fecha_respuesta)}</span>
                                            </div>
                                        </div>

                                        {solicitud.motivo_rechazo && (
                                            <div className={styles.motivoRechazoContainer}>
                                                <span className={styles.infoLabel}>
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    Motivo del administrador:
                                                </span>
                                                <p className={styles.motivoRechazoText}>
                                                    {solicitud.motivo_rechazo}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className={styles.notaHistorial}>
                                            <i className="fas fa-user-shield"></i>
                                            <p>
                                                Esta solicitud fue procesada por el administrador del sistema.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mensaje cuando no hay solicitudes */}
                    {solicitudes.length === 0 && (
                        <div className={styles.sinSolicitudes}>
                            <div className={styles.sinSolicitudesIcon}>
                                <i className="fas fa-file-alt fa-3x"></i>
                            </div>
                            <div className={styles.sinSolicitudesContent}>
                                <h3>No tienes solicitudes registradas</h3>
                                <p>
                                    Regresa al módulo de residencias para enviar tus solicitudes. 
                                    Una vez enviadas, aparecerán aquí con su estado actual.
                                </p>
                                <button 
                                    className={styles.btnIrResidencias}
                                    onClick={() => navigate('/residencias')}
                                >
                                    <i className="fas fa-arrow-left"></i>
                                    Ver Residencias Disponibles
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Botón flotante para volver a residencias */}
                <button 
                    className={styles.btnFlotante}
                    onClick={() => navigate('/residencias')}
                    aria-label="Volver a Residencias"
                >
                    <i className="fas fa-arrow-left"></i>
                    Volver a Residencias
                </button>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerSection}>
                            <h4>
                                <i className="fas fa-question-circle"></i>
                                Información importante
                            </h4>
                            <p>El administrador revisa y responde las solicitudes.</p>
                            <p>Solo puedes cancelar solicitudes pendientes.</p>
                            <p className={styles.contactoInfo}>
                                <i className="fas fa-envelope"></i> residencias@leon.tecnm.mx
                            </p>
                        </div>
                        <div className={styles.footerDerechos}>
                            <p className={styles.derechos}>
                                © 2025 TecNM León. Sistema de Residencias Profesionales.
                            </p>
                            <p className={styles.infoAdicional}>
                                Las decisiones de aceptación/rechazo las realiza el administrador
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}