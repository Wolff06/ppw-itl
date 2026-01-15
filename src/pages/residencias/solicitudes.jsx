import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './solicitudes.module.css';
import { useAuth } from '../../context/authContext';
import { supabase } from '../../lib/supabase';

export default function Solicitudes() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    
    const [solicitudes, setSolicitudes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        aceptadas: 0,
        pendientes: 0,
        rechazadas: 0
    });
    const [cargando, setCargando] = useState(true);
    const [solicitudAceptada, setSolicitudAceptada] = useState(null);
    
    // Cargar datos al inicio
    useEffect(() => {
        if (user && isAuthenticated) {
            cargarSolicitudesDesdeSupabase();
            
            const intervalo = setInterval(() => {
                cargarSolicitudesDesdeSupabase();
            }, 30000);
            
            return () => clearInterval(intervalo);
        }
    }, [user, isAuthenticated]);

    // Cargar solicitudes desde Supabase - VERSIÓN CORREGIDA CON TABLA "residencia"
    const cargarSolicitudesDesdeSupabase = async () => {
        try {
            setCargando(true);
            
            // CONSULTA CORRECTA: Obtener solicitudes con información de residencia y responsable
            // Usando tabla "residencia" (singular)
            const { data: solicitudesData, error } = await supabase
                .from('solicitud_alumno')
                .select(`
                    *,
                    residencia (
                        empresa,
                        descripcion,
                        fecha_inicio,
                        fecha_fin,
                        vacantes,
                        estado,
                        id_responsable,
                        responsableresidencia (
                            nombre,
                            apellido,
                            contacto,
                            correo
                        )
                    )
                `)
                .eq('id_alumno', user.id)
                .order('fecha_solicitud', { ascending: false });

            if (error) {
                console.error("Error cargando solicitudes:", error);
                throw error;
            }

            console.log("Datos obtenidos de Supabase:", solicitudesData);

            // Formatear datos para la UI
            const solicitudesFormateadas = solicitudesData.map(solicitud => {
                const residencia = solicitud.residencia;
                const responsable = residencia?.responsableresidencia;
                
                return {
                    id: solicitud.id_solicitud,
                    id_residencia: solicitud.id_residencia,
                    titulo: `Residencia ${solicitud.id_residencia} - ${residencia?.empresa || 'Empresa no disponible'}`,
                    empresa: residencia?.empresa || 'No disponible',
                    descripcion: residencia?.descripcion || 'No disponible',
                    requisitos: 'Estudiante activo, buen promedio, conocimientos básicos del área.',
                    responsable: `${responsable?.nombre || ''} ${responsable?.apellido || ''}`.trim() || 'No disponible',
                    contacto: responsable?.contacto || responsable?.correo || 'No disponible',
                    fecha_ini: residencia?.fecha_inicio,
                    fecha_fin: residencia?.fecha_fin,
                    vacantes: residencia?.vacantes || 0,
                    estado: solicitud.estado || 'Pendiente',
                    fecha_solicitud: solicitud.fecha_solicitud,
                    fecha_respuesta: solicitud.fecha_respuesta,
                    area: obtenerAreaPorEmpresa(residencia?.empresa),
                    motivo_rechazo: solicitud.motivo_rechazo,
                    puedeCancelar: solicitud.estado === 'Pendiente',
                    confirmacion: solicitud.confirmacion
                };
            });

            procesarSolicitudes(solicitudesFormateadas);
            
        } catch (error) {
            console.error("Error cargando solicitudes:", error);
            mostrarError(
                "Error al cargar",
                "No se pudieron cargar las solicitudes. Por favor, intenta de nuevo."
            );
        } finally {
            setCargando(false);
        }
    };

    // VERSIÓN ALTERNATIVA SI LA CONSULTA ANIDADA NO FUNCIONA
    const cargarSolicitudesDesdeSupabaseAlternativa = async () => {
        try {
            setCargando(true);
            
            // 1. Obtener solicitudes básicas
            const { data: solicitudesData, error } = await supabase
                .from('solicitud_alumno')
                .select('*')
                .eq('id_alumno', user.id)
                .order('fecha_solicitud', { ascending: false });

            if (error) {
                console.error("Error cargando solicitudes:", error);
                throw error;
            }

            console.log("Solicitudes básicas:", solicitudesData);

            // 2. Para cada solicitud, obtener datos de residencia y responsable
            const solicitudesCompletas = await Promise.all(
                solicitudesData.map(async (solicitud) => {
                    try {
                        // Obtener datos de la residencia
                        const { data: residenciaData, error: errorResidencia } = await supabase
                            .from('residencia')
                            .select('*')
                            .eq('id_residencia', solicitud.id_residencia)
                            .single();

                        if (errorResidencia) {
                            console.error(`Error obteniendo residencia ${solicitud.id_residencia}:`, errorResidencia);
                            return { ...solicitud, residencia: null, responsable: null };
                        }

                        // Obtener datos del responsable
                        let responsableData = null;
                        if (residenciaData.id_responsable) {
                            const { data: responsable, error: errorResponsable } = await supabase
                                .from('responsableresidencia')
                                .select('*')
                                .eq('id_responsable', residenciaData.id_responsable)
                                .single();

                            if (!errorResponsable) {
                                responsableData = responsable;
                            }
                        }

                        return {
                            ...solicitud,
                            residencia: residenciaData,
                            responsable: responsableData
                        };
                    } catch (error) {
                        console.error(`Error procesando solicitud ${solicitud.id_solicitud}:`, error);
                        return { ...solicitud, residencia: null, responsable: null };
                    }
                })
            );

            // 3. Formatear para UI
            const solicitudesFormateadas = solicitudesCompletas.map(item => ({
                id: item.id_solicitud,
                id_residencia: item.id_residencia,
                titulo: `Residencia ${item.id_residencia} - ${item.residencia?.empresa || 'Empresa no disponible'}`,
                empresa: item.residencia?.empresa || 'No disponible',
                descripcion: item.residencia?.descripcion || 'No disponible',
                requisitos: 'Estudiante activo, buen promedio, conocimientos básicos del área.',
                responsable: `${item.responsable?.nombre || ''} ${item.responsable?.apellido || ''}`.trim() || 'No disponible',
                contacto: item.responsable?.contacto || item.responsable?.correo || 'No disponible',
                fecha_ini: item.residencia?.fecha_inicio,
                fecha_fin: item.residencia?.fecha_fin,
                vacantes: item.residencia?.vacantes || 0,
                estado: item.estado || 'Pendiente',
                fecha_solicitud: item.fecha_solicitud,
                fecha_respuesta: item.fecha_respuesta,
                area: obtenerAreaPorEmpresa(item.residencia?.empresa),
                motivo_rechazo: item.motivo_rechazo,
                puedeCancelar: item.estado === 'Pendiente',
                confirmacion: item.confirmacion
            }));

            procesarSolicitudes(solicitudesFormateadas);
            
        } catch (error) {
            console.error("Error cargando solicitudes:", error);
            mostrarError(
                "Error al cargar",
                "No se pudieron cargar las solicitudes. Por favor, intenta de nuevo."
            );
        } finally {
            setCargando(false);
        }
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
        
        // Actualizar estado en residencias si hay una aceptada
        if (aceptada) {
            localStorage.setItem('estadoResidenciaUsuario', 'aceptada');
        } else {
            localStorage.removeItem('estadoResidenciaUsuario');
        }
    };

    // Función auxiliar para asignar área según empresa
    const obtenerAreaPorEmpresa = (empresa) => {
        if (!empresa) return 'General';
        const empresasAreas = {
            'Serviacero': 'Ingeniería Mecánica',
            'Audi Motors': 'Ingeniería Automotriz',
            'Ropa y Novedades Martha': 'Administración'
        };
        return empresasAreas[empresa] || 'General';
    };

    // Función para formatear fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "En espera";
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return fechaStr;
        }
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

    // Función para cancelar solicitud pendiente - CORREGIDA
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
                            procesarCancelacion(idSolicitud, solicitud);
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
        try {
            // 1. Primero, aumentar las vacantes en la residencia
            const { error: errorUpdateVacantes } = await supabase
                .from('residencia')  // CORREGIDO: 'residencia' (singular)
                .update({ 
                    vacantes: (solicitud.vacantes || 0) + 1 
                })
                .eq('id_residencia', solicitud.id_residencia);

            if (errorUpdateVacantes) {
                console.error('Error al actualizar vacantes:', errorUpdateVacantes);
                throw new Error('No se pudieron restaurar las vacantes');
            }

            // 2. Eliminar la solicitud de la base de datos
            const { error: errorDelete } = await supabase
                .from('solicitud_alumno')
                .delete()
                .eq('id_solicitud', idSolicitud);

            if (errorDelete) {
                console.error('Error al eliminar solicitud:', errorDelete);
                throw new Error('No se pudo eliminar la solicitud');
            }

            // 3. Actualizar el estado local
            const nuevasSolicitudes = solicitudes.filter(s => s.id !== idSolicitud);
            procesarSolicitudes(nuevasSolicitudes);
            
            // 4. Mostrar notificación
            mostrarExito(
                "Solicitud Cancelada",
                `Has cancelado la solicitud para: "${solicitud.titulo}". ` +
                `El administrador ha sido notificado y la vacante ha sido liberada.`
            );

            // 5. Disparar evento para que residencias.jsx se actualice
            window.dispatchEvent(new Event('residencias-updated'));

        } catch (error) {
            console.error('Error al cancelar solicitud:', error);
            mostrarError(
                "Error al cancelar",
                `Hubo un problema al cancelar la solicitud: ${error.message}. Por favor intenta de nuevo.`
            );
        }
    };

    // Función para confirmar una residencia aceptada
    const confirmarResidencia = async (idSolicitud) => {
        try {
            const { error } = await supabase
                .from('solicitud_alumno')
                .update({ 
                    confirmacion: 'Aceptado',
                    fecha_respuesta: new Date().toISOString()
                })
                .eq('id_solicitud', idSolicitud);

            if (error) throw error;

            mostrarExito(
                "Residencia Confirmada",
                "Has confirmado tu aceptación de la residencia. Por favor contacta a la empresa para coordinar tu inicio."
            );

            // Recargar las solicitudes
            await cargarSolicitudesDesdeSupabase();

        } catch (error) {
            console.error('Error al confirmar residencia:', error);
            mostrarError(
                "Error al confirmar",
                "No se pudo confirmar la residencia. Por favor intenta de nuevo."
            );
        }
    };

    // Función para rechazar una residencia aceptada - CORREGIDA
    const rechazarResidencia = async (idSolicitud) => {
        try {
            // Primero, aumentar las vacantes (porque se rechaza una residencia aceptada)
            const solicitud = solicitudes.find(s => s.id === idSolicitud);
            
            if (solicitud && solicitud.id_residencia) {
                const { error: errorUpdateVacantes } = await supabase
                    .from('residencia')  // CORREGIDO: 'residencia' (singular)
                    .update({ 
                        vacantes: (solicitud.vacantes || 0) + 1 
                    })
                    .eq('id_residencia', solicitud.id_residencia);

                if (errorUpdateVacantes) {
                    console.error('Error al actualizar vacantes:', errorUpdateVacantes);
                }
            }

            // Actualizar el estado de la solicitud a Rechazado
            const { error } = await supabase
                .from('solicitud_alumno')
                .update({ 
                    estado: 'Rechazado',
                    confirmacion: 'Rechazado',
                    fecha_respuesta: new Date().toISOString(),
                    motivo_rechazo: 'Rechazado por el alumno'
                })
                .eq('id_solicitud', idSolicitud);

            if (error) throw error;

            mostrarExito(
                "Residencia Rechazada",
                "Has rechazado la residencia aceptada. Ahora podrás solicitar otras residencias disponibles."
            );

            // Recargar las solicitudes
            await cargarSolicitudesDesdeSupabase();

            // Disparar evento para que residencias.jsx se actualice
            window.dispatchEvent(new Event('residencias-updated'));

        } catch (error) {
            console.error('Error al rechazar residencia:', error);
            mostrarError(
                "Error al rechazar",
                "No se pudo rechazar la residencia. Por favor intenta de nuevo."
            );
        }
    };

    // Función para actualizar las solicitudes manualmente
    const verificarActualizaciones = () => {
        mostrarInfo(
            "Verificando actualizaciones",
            "Buscando actualizaciones del administrador..."
        );
        
        cargarSolicitudesDesdeSupabase();
    };

    // Obtener solicitudes por estado
    const solicitudesPendientes = solicitudes.filter(s => s.estado === "Pendiente");
    const solicitudesAceptadas = solicitudes.filter(s => s.estado === "Aceptado");
    const solicitudesRechazadas = solicitudes.filter(s => s.estado === "Rechazado");

    // Mostrar loading
    if (cargando) {
        return (
            <Seccion title="MIS SOLICITUDES">
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}>
                            <i className="fas fa-spinner fa-spin fa-3x"></i>
                        </div>
                        <p>Cargando tus solicitudes...</p>
                    </div>
                </div>
            </Seccion>
        );
    }

    // Verificar autenticación
    if (!isAuthenticated) {
        return null;
    }

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
                                    El administrador ha aprobado tu solicitud. {solicitudAceptada.confirmacion === 'Aceptado' ? 'Ya confirmaste esta residencia.' : 'Por favor confirma tu aceptación.'}
                                </p>
                            </div>
                            {solicitudAceptada.confirmacion !== 'Aceptado' && (
                                <div className={styles.bannerActions}>
                                    <button 
                                        className={styles.btnConfirmar}
                                        onClick={() => confirmarResidencia(solicitudAceptada.id)}
                                        title="Confirmar aceptación de residencia"
                                    >
                                        <i className="fas fa-check"></i>
                                        Confirmar
                                    </button>
                                    <button 
                                        className={styles.btnRechazar}
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de rechazar esta residencia aceptada? Podrás solicitar otras residencias disponibles.')) {
                                                rechazarResidencia(solicitudAceptada.id);
                                            }
                                        }}
                                        title="Rechazar residencia aceptada"
                                    >
                                        <i className="fas fa-times"></i>
                                        Rechazar
                                    </button>
                                </div>
                            )}
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

                    {/* Botón para actualizar manualmente */}
                    <div className={styles.botonActualizaciones}>
                        <button 
                            className={styles.btnActualizar}
                            onClick={verificarActualizaciones}
                        >
                            <i className="fas fa-sync-alt"></i>
                            Actualizar solicitudes
                        </button>
                        <p className={styles.notaActualizaciones}>
                            <i className="fas fa-info-circle"></i>
                            Las solicitudes se actualizan automáticamente cada 30 segundos
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
                                        {solicitudAceptada.confirmacion === 'Aceptado' && (
                                            <span className={styles.confirmacionBadge}>
                                                <i className="fas fa-check-double"></i>
                                                Confirmado por ti
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
                                            <h4>{solicitudAceptada.confirmacion === 'Aceptado' ? 'Residencia Confirmada' : 'Residencia Pendiente de Confirmación'}</h4>
                                            <p>
                                                {solicitudAceptada.confirmacion === 'Aceptado' 
                                                    ? 'Tu residencia ha sido confirmada. Ya no puedes solicitar otras residencias. Por favor, contacta a la empresa para coordinar tu inicio.'
                                                    : 'Tu residencia ha sido aprobada por el administrador. Por favor, confirma tu aceptación para proceder.'}
                                            </p>
                                        </div>
                                    </div>

                                    {solicitudAceptada.confirmacion !== 'Aceptado' && (
                                        <div className={styles.empresaActions}>
                                            <button 
                                                className={styles.btnConfirmarAccion}
                                                onClick={() => confirmarResidencia(solicitudAceptada.id)}
                                            >
                                                <i className="fas fa-check"></i>
                                                Confirmar Residencia
                                            </button>
                                            <button 
                                                className={styles.btnRechazarAccion}
                                                onClick={() => {
                                                    if (window.confirm('¿Estás seguro de rechazar esta residencia aceptada?')) {
                                                        rechazarResidencia(solicitudAceptada.id);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                                Rechazar Residencia
                                            </button>
                                        </div>
                                    )}
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