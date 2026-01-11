import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './reportes.module.css';



export default function Reportes() {
    const navigate = useNavigate();
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: "Juan Pérez", // Estos vendrían del usuario logueado
        numero_control: "202512345", // Estos vendrían del usuario logueado
        situacion: '',
        archivo: null
    });
    
    // Estados de la UI
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [archivoNombre, setArchivoNombre] = useState('');
    const [esValido, setEsValido] = useState(false);
    
    // Simular datos del usuario (en una app real vendrían de auth/context)
    const usuario = {
        nombre: "Juan Pérez",
        matricula: "202512345",
        carrera: "Ingeniería en Sistemas Computacionales",
        email: "juan.perez@leon.tecnm.mx"
    };

    // Validar formulario en cada cambio
    useEffect(() => {
        const situacionLlena = formData.situacion.trim() !== '';
        const archivoSeleccionado = formData.archivo !== null;
        setEsValido(situacionLlena || archivoSeleccionado);
    }, [formData.situacion, formData.archivo]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Limpiar errores al cambiar
    };

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validar tipo de archivo (solo PDF)
            if (file.type !== 'application/pdf') {
                setError('Solo se permiten archivos PDF');
                e.target.value = ''; // Limpiar input
                setFormData(prev => ({ ...prev, archivo: null }));
                setArchivoNombre('');
                return;
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no debe exceder los 5MB');
                e.target.value = '';
                setFormData(prev => ({ ...prev, archivo: null }));
                setArchivoNombre('');
                return;
            }
            
            setFormData(prev => ({ ...prev, archivo: file }));
            setArchivoNombre(file.name);
            setError('');
        }
    };

    // Eliminar archivo seleccionado
    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, archivo: null }));
        setArchivoNombre('');
        document.getElementById('archivo').value = '';
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!esValido) {
            setError('Debe describir la situación o adjuntar un archivo PDF');
            return;
        }
        
        setCargando(true);
        setError('');
        
        try {
            // Simular envío a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Aquí iría la llamada real a la API:
            // const formDataToSend = new FormData();
            // formDataToSend.append('nombre', formData.nombre);
            // formDataToSend.append('numero_control', formData.numero_control);
            // formDataToSend.append('situacion', formData.situacion);
            // if (formData.archivo) {
            //     formDataToSend.append('archivo', formData.archivo);
            // }
            
            // const response = await fetch('/api/reportes/enviar', {
            //     method: 'POST',
            //     body: formDataToSend
            // });
            
            // if (!response.ok) throw new Error('Error al enviar el reporte');
            
            // Mostrar modal de éxito
            setMostrarModal(true);
            
            // Limpiar formulario
            setFormData({
                nombre: usuario.nombre,
                numero_control: usuario.matricula,
                situacion: '',
                archivo: null
            });
            setArchivoNombre('');
            
        } catch (error) {
            setError('Error al enviar el reporte. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setCargando(false);
        }
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setMostrarModal(false);
    };

    // Cancelar y volver
    const handleCancelar = () => {
        if (formData.situacion.trim() !== '' || formData.archivo) {
            if (window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
                navigate('/');
            }
        } else {
            navigate('/');
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
        <Seccion title="REPORTES ACADÉMICOS">
            <div className={styles.pageContainer}>
                
                {/* Contenido principal */}
                <main className={styles.contenido}>
                    {/* Información del usuario */}
                    <div className={styles.usuarioInfo}>
                        <div className={styles.usuarioCard}>
                            <div className={styles.usuarioHeader}>
                                <i className="fas fa-user-circle"></i>
                                <h3>Información del Reportante</h3>
                            </div>
                            <div className={styles.usuarioDetails}>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.usuarioLabel}>Nombre:</span>
                                    <span className={styles.usuarioValue}>{usuario.nombre}</span>
                                </div>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.usuarioLabel}>Matrícula:</span>
                                    <span className={styles.usuarioValue}>{usuario.matricula}</span>
                                </div>
                                <div className={styles.usuarioItem}>
                                    <span className={styles.usuarioLabel}>Carrera:</span>
                                    <span className={styles.usuarioValue}>{usuario.carrera}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form id="reportForm" className={styles.formulario} onSubmit={handleSubmit}>
                        <div className={styles.formContainer}>
                            <div className={styles.formGrid}>
                                {/* Campo Nombre (solo lectura) */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="nombre" className={styles.formLabel}>
                                        <i className="fas fa-user"></i>
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        readOnly
                                        className={styles.formInput}
                                    />
                                    <p className={styles.formHint}>
                                        <i className="fas fa-info-circle"></i>
                                        Este campo se completa automáticamente
                                    </p>
                                </div>

                                {/* Campo Número de Control (solo lectura) */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="numero_control" className={styles.formLabel}>
                                        <i className="fas fa-id-card"></i>
                                        Número de Control
                                    </label>
                                    <input
                                        type="text"
                                        id="numero_control"
                                        name="numero_control"
                                        value={formData.numero_control}
                                        readOnly
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>

                            {/* Campo Descripción de la Situación */}
                            <div className={styles.formGroup}>
                                <label htmlFor="situacion" className={styles.formLabel}>
                                    <i className="fas fa-file-alt"></i>
                                    Descripción de la Situación
                                    <span className={styles.required}> *</span>
                                </label>
                                <textarea
                                    id="situacion"
                                    name="situacion"
                                    value={formData.situacion}
                                    onChange={handleChange}
                                    placeholder="Describa detalladamente la situación que desea reportar..."
                                    className={styles.formTextarea}
                                    rows={6}
                                />
                                <p className={styles.formHint}>
                                    <i className="fas fa-lightbulb"></i>
                                    Describa el problema de manera clara y detallada. Incluya nombres, fechas y cualquier información relevante.
                                </p>
                                <div className={styles.contadorCaracteres}>
                                    <span>{formData.situacion.length}</span> / 2000 caracteres
                                </div>
                            </div>

                            {/* Campo Adjuntar Archivo */}
                            <div className={styles.formGroup}>
                                <label htmlFor="archivo" className={styles.formLabel}>
                                    <i className="fas fa-paperclip"></i>
                                    Adjuntar Archivo (PDF)
                                </label>
                                
                                {/* Input de archivo personalizado */}
                                <div className={styles.fileInputContainer}>
                                    <input
                                        type="file"
                                        id="archivo"
                                        name="archivo"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                    />
                                    <label htmlFor="archivo" className={styles.fileInputLabel}>
                                        <i className="fas fa-upload"></i>
                                        <span>Seleccionar archivo PDF</span>
                                        <p className={styles.fileInputHint}>Tamaño máximo: 5MB</p>
                                    </label>
                                </div>

                                {/* Archivo seleccionado */}
                                {archivoNombre && (
                                    <div className={styles.fileSelected}>
                                        <div className={styles.fileInfo}>
                                            <i className="fas fa-file-pdf"></i>
                                            <div className={styles.fileDetails}>
                                                <span className={styles.fileName}>{archivoNombre}</span>
                                                <span className={styles.fileSize}>
                                                    {formData.archivo ? Math.round(formData.archivo.size / 1024) : 0} KB
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.fileRemove}
                                            onClick={handleRemoveFile}
                                            aria-label="Eliminar archivo"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}

                                <p className={styles.formHint}>
                                    <i className="fas fa-info-circle"></i>
                                    Adjunte evidencia en formato PDF. Este campo es opcional pero recomendado.
                                </p>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className={styles.errorMessage}>
                                    <i className="fas fa-exclamation-circle"></i>
                                    {error}
                                </div>
                            )}

                            {/* Nota importante */}
                            <div className={styles.notaImportante}>
                                <div className={styles.notaIcon}>
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className={styles.notaContent}>
                                    <h4>Importante</h4>
                                    <p>
                                        Los reportes serán revisados por el equipo académico correspondiente. 
                                        Se requiere al menos la descripción de la situación o un archivo adjunto.
                                        La respuesta será enviada a su correo institucional.
                                    </p>
                                </div>
                            </div>

                            {/* Botones del formulario */}
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
                                            Enviar Reporte
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
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
                                    <i className="fas fa-check-circle"></i>
                                    <h2>Reporte Enviado</h2>
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
                                    <i className="fas fa-clipboard-check"></i>
                                </div>
                                
                                <div className={styles.modalContent}>
                                    <h3>¡Su reporte académico ha sido enviado exitosamente!</h3>
                                    <p>
                                        Su solicitud será revisada por el equipo académico correspondiente 
                                        y recibirá una respuesta en la brevedad posible.
                                    </p>
                                    
                                    <div className={styles.modalInfo}>
                                        <div className={styles.modalInfoItem}>
                                            <i className="fas fa-clock"></i>
                                            <div>
                                                <strong>Tiempo de respuesta estimado:</strong>
                                                <span>3-5 días hábiles</span>
                                            </div>
                                        </div>
                                        <div className={styles.modalInfoItem}>
                                            <i className="fas fa-envelope"></i>
                                            <div>
                                                <strong>Contacto para seguimiento:</strong>
                                                <span className={styles.modalEmail}>servicioITLescolar@tecmn.mx</span>
                                            </div>
                                        </div>
                                        <div className={styles.modalInfoItem}>
                                            <i className="fas fa-user"></i>
                                            <div>
                                                <strong>Reportante:</strong>
                                                <span>{usuario.nombre}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.modalNota}>
                                        <i className="fas fa-info-circle"></i>
                                        <p>
                                            Para consultas urgentes, puede presentarse en la oficina de 
                                            Servicios Escolares en el horario de atención.
                                        </p>
                                    </div>
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
                                <i className="fas fa-shield-alt"></i>
                                Confidencialidad
                            </h4>
                            <p>Todos los reportes se manejan con absoluta confidencialidad.</p>
                            <p>Su información personal está protegida.</p>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>
                                <i className="fas fa-headset"></i>
                                Soporte
                            </h4>
                            <p>Para asistencia inmediata:</p>
                            <p className={styles.footerContact}>
                                <i className="fas fa-envelope"></i>
                                reportes@leon.tecnm.mx
                            </p>
                        </div>
                        <div className={styles.footerDerechos}>
                            <p className={styles.derechos}>
                                © 2025 TecNM León. Sistema de Reportes Académicos.
                            </p>
                            <p className={styles.infoAdicional}>
                                Departamento de Servicios Escolares | Tel: 477 710 0000 Ext. 1201
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Seccion>
    );
}