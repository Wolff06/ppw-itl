import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './examen-psicometrico.module.css';

export default function ExamenPsicometrico() {
    const navigate = useNavigate();
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: "Juan Pérez", // Estos vendrían del usuario logueado
        telefono: '',
        email: 'mitzzeh072@gmail.com',
        mensaje: ''
    });
    
    // Estados de la UI
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [esValido, setEsValido] = useState(false);
    const [telefonoFormateado, setTelefonoFormateado] = useState(''); // Nuevo estado para el formato
    
    // Simular datos del usuario (en una app real vendrían de auth/context)
    const usuario = {
        nombre: "Juan Pérez",
        matricula: "202512345",
        carrera: "Ingeniería en Sistemas Computacionales",
        email: "juan.perez@leon.tecnm.mx"
    };

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

        // Limpiar formulario excepto el nombre y email
        setFormData({
            nombre: usuario.nombre,
            telefono: '',
            email: formData.email, // Mantener el email para comodidad del usuario
            mensaje: ''
        });
        setTelefonoFormateado('');
    };

    // Cancelar y volver
    const handleCancelar = () => {
        if (formData.telefono.trim() !== '' || formData.email.trim() !== '' || formData.mensaje.trim() !== '') {
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

    return (
        <Seccion title="EXAMEN PSICOMÉTRICO">
            <div className={styles.pageContainer}>
                {/* Contenido principal */}
                <main className={styles.contenido}>
                    <form id="examForm" className={styles.formulario} onSubmit={handleSubmit}>
                        <fieldset className={styles.fieldset}>
                            <table className={styles.formTable}>
                                <tbody>
                                <tr className={styles.formRow}>
                                    <th className={styles.instructionsColumn}>
                                        <ul className={styles.instructionsList}>
                                            <li>Ingresa tu nombre completo:
                                                <ul>
                                                    <li>(De esta forma podremos personalizar tu experiencia).</li>
                                                </ul>
                                            </li>
                                            <li>Introduce tu numero de telefono:
                                                <ul>
                                                    <li>(Es necesario para contacto rápido en caso de que surja algún inconveniente).</li>
                                                </ul>
                                            </li>
                                            <li>Escribe tu correo electronico:
                                                <ul>
                                                    <li>(Aquí te enviaremos el link para acceder al examen psicométrico).</li>
                                                </ul>
                                            </li>
                                            <li>Mensaje opcional:
                                                <ul>
                                                    <li>(Ecribe cualquier mensaje que quieras incluir. Si tienes dudas o comentarios, este es el espacio adecuado).</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </th>
                                    <th className={styles.inputsColumn}>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                readOnly
                                                className={styles.formInput}
                                                placeholder="Nombre completo"
                                            />
                                        </div>

                                        <div className={styles.inputGroup}>
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
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={styles.formInput}
                                                placeholder="Correo electrónico"
                                                required
                                            />
                                            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                                <span className={styles.helpText}>
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    Ingrese un correo electrónico válido
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.inputGroup}>
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
                                    </th>
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