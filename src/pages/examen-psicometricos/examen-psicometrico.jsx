import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './examen-psicometrico.module.css';
import { useAuth } from '../../context/authContext';
import { supabase } from '../../lib/supabase'; 

export default function ExamenPsicometrico() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        numero_control: "",
        telefono: '',
        email: '',
        mensaje: ''
    });
    
    // Estados de la UI
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [esValido, setEsValido] = useState(false);
    const [telefonoFormateado, setTelefonoFormateado] = useState('');
    const [carreraUsuario, setCarreraUsuario] = useState('');
    const [correoInstitucional, setCorreoInstitucional] = useState('');
    
    // Cargar datos del usuario cuando se autentica
    useEffect(() => {
        if (user) {
            // Establecer nombre y número de control
            setFormData(prev => ({
                ...prev,
                nombre: user.nombreCompleto || `${user.nombre || ''} ${user.apellido || ''}`.trim() || "Usuario",
                numero_control: user.id || ''
            }));
            
            // Obtener carrera del alumno (si existe)
            if (user.id) {
                const obtenerDatosAlumno = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('alumno')
                            .select('carrera')
                            .eq('no_control', user.id)
                            .single();
                            
                        if (!error && data) {
                            setCarreraUsuario(data.carrera);
                        }
                    } catch (err) {
                        console.error('Error al obtener carrera:', err);
                    }
                };
                
                obtenerDatosAlumno();
            }
            
            // Obtener correo institucional de la tabla usuarios
            const obtenerCorreoInstitucional = async () => {
                try {
                    const { data, error } = await supabase
                        .from('usuario')
                        .select('correo_institucional')
                        .eq('id', user.id) // O la columna correcta que relacione con auth
                        .single();
                        
                    if (!error && data && data.correo_institucional) {
                        setCorreoInstitucional(data.correo_institucional);
                        setFormData(prev => ({
                            ...prev,
                            email: data.correo_institucional
                        }));
                    } else {
                        // Si no hay correo institucional, usar el email del auth o uno por defecto
                        setFormData(prev => ({
                            ...prev,
                            email: user.email || ''
                        }));
                    }
                } catch (err) {
                    console.error('Error al obtener correo institucional:', err);
                    // En caso de error, usar email del usuario o por defecto
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || ''
                    }));
                }
            };
            
            obtenerCorreoInstitucional();
        }
    }, [user]);

    // Verificar autenticación
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Formatear teléfono para mostrar
    const formatearTelefono = (telefono) => {
        const nums = telefono.replace(/\D/g, '');
        if (nums.length <= 3) return nums;
        if (nums.length <= 6) return `(${nums.slice(0,3)}) ${nums.slice(3)}`;
        return `(${nums.slice(0,3)}) ${nums.slice(3,6)}-${nums.slice(6,10)}`;
    };

    // Actualizar teléfono formateado cuando cambie el teléfono
    useEffect(() => {
        setTelefonoFormateado(formatearTelefono(formData.telefono));
    }, [formData.telefono]);

    // Validar formulario en cada cambio
    useEffect(() => {
        const numsTelefono = formData.telefono.replace(/\D/g, '');
        const telefonoValido = numsTelefono.length === 10;
        const emailValido = formData.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        setEsValido(telefonoValido && emailValido);
    }, [formData.telefono, formData.email]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Limpiar errores al cambiar
    };

    // Manejar cambio específico para teléfono
    const handleTelefonoChange = (e) => {
        let value = e.target.value;
        
        // Remover todo excepto números
        const nums = value.replace(/\D/g, '');
        
        // Limitar a 10 dígitos
        if (nums.length <= 10) {
            setFormData(prev => ({
                ...prev,
                telefono: nums
            }));
            setError(''); // Limpiar errores al cambiar
        }
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const numsTelefono = formData.telefono.replace(/\D/g, '');
        if (numsTelefono.length !== 10) {
            setError('El número de teléfono debe tener exactamente 10 dígitos');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Por favor ingrese un correo electrónico válido');
            return;
        }
        
        setCargando(true);
        setError('');
        
        try {
            // Aquí puedes guardar en Supabase si lo necesitas
            // Por ejemplo, crear una tabla "solicitudes_examen" o similar
            /*
            const { data, error } = await supabase
                .from('solicitudes_examen')
                .insert([{
                    id_alumno: user.id,
                    nombre: formData.nombre,
                    telefono: formData.telefono,
                    email: formData.email,
                    mensaje: formData.mensaje,
                    fecha_solicitud: new Date().toISOString()
                }]);
            
            if (error) throw error;
            */
            
            // Simular envío a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mostrar modal de éxito
            setMostrarModal(true);
            
        } catch (error) {
            setError('Error al enviar la solicitud. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setCargando(false);
        }
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setMostrarModal(false);
        
        // Limpiar formulario excepto los datos del usuario
        setFormData({
            nombre: user ? (user.nombreCompleto || `${user.nombre || ''} ${user.apellido || ''}`.trim()) : "",
            numero_control: user ? user.id : '',
            telefono: '',
            email: correo_institucional || user?.email || '',
            mensaje: ''
        });
        setTelefonoFormateado('');
    };

    // Cancelar y volver
    const handleCancelar = () => {
        if (formData.telefono.trim() !== '' || formData.email.trim() !== correoInstitucional || formData.mensaje.trim() !== '') {
            if (window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
                navigate('/inicio');
            }
        } else {
            navigate('/inicio');
        }
    };

    // Cerrar modal con tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && mostrarModal) {
                handleCloseModal();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [mostrarModal]);

    // Mostrar loading mientras se verifica autenticación
    if (authLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // No renderizar mientras redirige
    }

    return (
        <Seccion title="EXAMEN PSICOMÉTRICO">
            <div className={styles.pageContainer}>
                {/* Contenido principal */}
                <main className={styles.contenido}>
                    
                    {/* Información del usuario (similar al módulo de reportes) */}
                    <div className={styles.usuarioInfo}>
                        <div className={styles.usuarioCard}>
                            <div className={styles.usuarioHeader}>
                                <i className="fas fa-user-circle"></i>
                                <h3>Información del Estudiante</h3>
                            </div>
                            <div className={styles.usuarioDetails}>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.usuarioLabel}>Nombre:</span>
                                    <span className={styles.usuarioValue}>{formData.nombre}</span>
                                </div>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.usuarioLabel}>Matrícula:</span>
                                    <span className={styles.usuarioValue}>{formData.numero_control}</span>
                                </div>
                                {carreraUsuario && (
                                    <div className={styles.usuarioItem}>
                                        <span className={styles.usuarioLabel}>Carrera:</span>
                                        <span className={styles.usuarioValue}>
                                            {carreraUsuario}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form id="examForm" className={styles.formulario} onSubmit={handleSubmit}>
                        <fieldset className={styles.fieldset}>
                            <table className={styles.formTable}>
                                <tbody>
                                    <tr className={styles.formRow}>
                                        <td className={styles.instructionsColumn}>
                                            <ul className={styles.instructionsList}>
                                                <li>Verifica tu información:
                                                    <ul>
                                                        <li>Tu nombre y matrícula ya están registrados.</li>
                                                    </ul>                            
                                                </li>
                                                <li>Introduce tu numero de teléfono:
                                                    <ul>
                                                        <li>(Es necesario para contacto rápido en caso de que surja algún inconveniente).</li>
                                                    </ul>
                                                </li>
                                                <li>Verifica tu correo electrónico:
                                                    <ul>
                                                        <li>(Aquí te enviaremos el link para acceder al examen psicométrico).</li>
                                                    </ul>
                                                </li>
                                                <li>Mensaje opcional:
                                                    <ul>
                                                        <li>(Escribe cualquier mensaje que quieras incluir. Si tienes dudas o comentarios, este es el espacio adecuado).</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </td>
                                        <td className={styles.inputsColumn}>
                                            {/* Campo Nombre (solo lectura) */}
                                            <div className={styles.inputGroup}>
                                                <label className={styles.formLabel}>
                                                    <i className="fas fa-user"></i>
                                                    Nombre Completo
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    readOnly
                                                    className={styles.formInput}
                                                    placeholder="Nombre completo"
                                                />
                                                <p className={styles.formHint}>
                                                    <i className="fas fa-info-circle"></i>
                                                    Este campo se completa automáticamente con tus datos
                                                </p>
                                            </div>
                                            
                                            {/* Campo Número de Control (solo lectura) */}
                                            <div className={styles.inputGroup}>
                                                <label className={styles.formLabel}>
                                                    <i className="fas fa-id-card"></i>
                                                    Número de Control
                                                </label>
                                                <input
                                                    type="text"
                                                    name="numero_control"
                                                    value={formData.numero_control}
                                                    readOnly
                                                    className={styles.formInput}
                                                    placeholder="Número de control"
                                                />
                                            </div>
                                            
                                            <div className={styles.inputGroup}>
                                                <label className={styles.formLabel}>
                                                    <i className="fas fa-phone"></i>
                                                    Número de Teléfono
                                                    <span className={styles.required}> *</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={telefonoFormateado}
                                                    onChange={handleTelefonoChange}
                                                    className={styles.formInput}
                                                    placeholder="Número de teléfono (10 dígitos)"
                                                    required
                                                />
                                                {formData.telefono && formData.telefono.replace(/\D/g, '').length !== 10 && (
                                                    <span className={styles.helpText}>
                                                        <i className="fas fa-exclamation-circle"></i>
                                                        El teléfono debe tener exactamente 10 dígitos
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className={styles.inputGroup}>
                                                <label className={styles.formLabel}>
                                                    <i className="fas fa-envelope"></i>
                                                    Correo Electrónico
                                                    <span className={styles.required}> *</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                    placeholder="Correo electrónico"
                                                    required
                                                />
                                                {correoInstitucional && formData.email === correoInstitucional && (
                                                    <p className={styles.formHint}>
                                                        <i className="fas fa-check-circle"></i>
                                                        Se está usando tu correo institucional registrado
                                                    </p>
                                                )}
                                                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                                    <span className={styles.helpText}>
                                                        <i className="fas fa-exclamation-circle"></i>
                                                        Ingrese un correo electrónico válido
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className={styles.inputGroup}>
                                                <label className={styles.formLabel}>
                                                    <i className="fas fa-comment"></i>
                                                    Mensaje Opcional
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    name="mensaje"
                                                    value={formData.mensaje}
                                                    onChange={handleChange}
                                                    className={styles.formTextarea}
                                                    placeholder="Escribe tu mensaje aquí"
                                                />
                                            </div>
                                            
                                            {/* Botones */}
                                            <div className={styles.formButtons}>
                                                <button
                                                    type="button"
                                                    className={styles.btnCancelar}
                                                    onClick={handleCancelar}
                                                    disabled={cargando}
                                                >
                                                    <i className="fas fa-times"></i>
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className={styles.btnEnviar}
                                                    disabled={!esValido || cargando}
                                                >
                                                    {cargando ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                            Enviando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-paper-plane"></i>
                                                            Solicitar Examen
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>

                    {/* Mensaje de error */}
                    {error && (
                        <div className={styles.errorMessage}>
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className={styles.infoAdicional}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <h3>Información Importante</h3>
                                <ul>
                                    <li>El examen psicométrico es obligatorio para todos los estudiantes de nuevo ingreso</li>
                                    <li>El enlace se enviará al correo electrónico proporcionado en un plazo máximo de 24 horas</li>
                                    <li>El examen debe completarse en una sola sesión (duración aproximada: 45-60 minutos)</li>
                                    <li>Para cualquier duda, contactar a: <strong>servicioITLescolar@tecmn.mx</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modal de confirmación */}
                {mostrarModal && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div 
                            className={styles.modalContainer} 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div className={styles.modalTitle}>
                                    <span className={styles.successIcon}>✓</span>
                                    <h2>Solicitud Enviada</h2>
                                </div>
                                <button 
                                    className={styles.modalClose}
                                    onClick={handleCloseModal}
                                    aria-label="Cerrar modal"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div className={styles.modalBody}>
                                <div className={styles.modalIcon}>
                                    <span className={styles.emailIcon}>📧</span>
                                </div>
                                
                                <div className={styles.modalContent}>
                                    <p><strong>¡Tu solicitud ha sido enviada exitosamente!</strong></p>
                                    <p>El link para acceder al examen psicométrico será enviado a tu correo electrónico en la brevedad posible.</p>
                                    <p>Si por alguna razón no recibes el correo, por favor contacta con:</p>
                                    <p className={styles.emailHighlight}>
                                        servicioITLescolar@tecmn.mx
                                    </p>
                                </div>
                            </div>
                            
                            <div className={styles.modalFooter}>
                                <button 
                                    className={styles.modalButton}
                                    onClick={handleCloseModal}
                                >
                                    <i className="fas fa-check"></i>
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerSection}>
                            <h4>
                                <i className="fas fa-clock"></i>
                                Tiempo de Respuesta
                            </h4>
                            <p>El enlace del examen se envía en un plazo máximo de 24 horas hábiles.</p>
                            <p>Horario de atención: Lunes a Viernes 8:00 - 15:00 hrs.</p>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>
                                <i className="fas fa-headset"></i>
                                Soporte Técnico
                            </h4>
                            <p>Para problemas técnicos con el examen:</p>
                            <p className={styles.footerContact}>
                                <i className="fas fa-envelope"></i>
                                soporte.examenes@leon.tecnm.mx
                            </p>
                        </div>
                        <div className={styles.footerDerechos}>
                            <div className={styles.derechos}>
                                © 2025 TecNM León. Sistema de Exámenes Psicométricos.
                            </div>
                            <div className={styles.infoAdicional}>
                                Departamento de Servicios Escolares | Tel: 477 710 0000 Ext. 1201
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}