
import styles from "./InicioSesion.module.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoVertical from '../../assets/backgrounds/LogoTecNMVertical_Blanco-150x150(1).png';
import iconoITL from '../../assets/logos/itl_icon.png';
import alumnosBg from '../../assets/backgrounds/alumnos2.jpg';
import {handleLogin} from "../../assets/scripts/serverless/auth.js";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_usuario: '',
        contrasenia: ''
    });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Limpiar error al cambiar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.id_usuario.trim() || !formData.contrasenia.trim()) {
            setError('Por favor complete todos los campos');
            return;
        }
        
        setCargando(true);
        setError('');

        try {
            // Simular llamada a API de autenticación

            await handleLogin(formData.id_usuario, formData.contrasenia).then((data)=>{
                console.log(data.user);
                // Redirigir al inicio
                navigate("/inicio");
            });
            
        } catch (error) {
            setError('Credenciales incorrectas. Por favor, intente nuevamente.');
            console.error('Error de autenticación:', error);
        } finally {
            setCargando(false);
        }
    };

    // Manejar tecla Enter para enviar
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div 
            className={styles.pageContainer}
            style={{
                backgroundImage: `linear-gradient(to right,
                    rgba(23, 34, 77, 1.0) 0%,
                    rgba(23, 34, 77, 0.55) 50%,
                    rgba(23, 34, 77, 1.0) 100%
                ), url(${alumnosBg})`
            }}
        >
            {/* Encabezado */}
            <header className={styles.encabezado}>
                <h1>INSTITUTO TECNOLÓGICO DE LEÓN</h1>
                <img src={logoVertical} alt="LogoTecNM" className={styles.logoVertical} />
                <img src={iconoITL} alt="Icono Instituto" className={styles.iconoITL} />
            </header>

            {/* Formulario de Login */}
            <div className={styles.formContainer}>
                <fieldset className={styles.fieldset}>
                    <h1 className={styles.titulo}>INICIO DE SESIÓN</h1>

                    {error && (
                        <p className={styles.error}>{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className={styles.formulario}>
                        <div className={styles.formGroup}>
                            <label htmlFor="id_usuario" className={styles.formLabel}>
                                ID de Usuario:
                            </label>
                            <input
                                type="text"
                                id="id_usuario"
                                name="id_usuario"
                                value={formData.id_usuario}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                className={styles.input}
                                placeholder="Ingrese su ID de usuario"
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="contrasenia" className={styles.formLabel}>
                                Contraseña:
                            </label>
                            <input
                                type="password"
                                id="contrasenia"
                                name="contrasenia"
                                value={formData.contrasenia}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                className={styles.input}
                                placeholder="Ingrese su contraseña"
                                required
                                disabled={cargando}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.botonIngresar}
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    INGRESANDO...
                                </>
                            ) : (
                                'INGRESAR'
                            )}
                        </button>
                    </form>

                    {/* Información adicional */}
                    <div className={styles.infoAdicional}>
                        <p className={styles.infoTexto}>
                            <i className="fas fa-info-circle"></i>
                            Si tiene problemas para ingresar, contacte al departamento de sistemas.
                        </p>
                        <p className={styles.contacto}>
                            <i className="fas fa-envelope"></i>
                            soporte.sistemas@leon.tecnm.mx
                        </p>
                    </div>
                </fieldset>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p>© 2025 TecNM León. Todos los derechos reservados.</p>
                    <p className={styles.footerInfo}>
                        Departamento de Sistemas | Tel: 477 710 0000 Ext. 1301
                    </p>
                </div>
            </footer>
        </div>
    );
}