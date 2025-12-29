import styles from "./Inicio.module.css";
import {useNavigate, Link} from 'react-router-dom';

export default function Inicio() {
    const navigate= useNavigate();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.navbar}>
                <input type="checkbox" id="burger-btn" className={styles.burgerButton}/>
                <label htmlFor="burger-btn" className={styles.burgerLabel}>☰ MENÚ</label>
                <div className={styles.container}>
                    <div className={styles.logo}><img src="" alt="ITL Logo"/></div>
                    <div className={styles.vSpacer}></div>
                    <div className={styles.item}><button>Aula Virtual</button></div>
                    <div className={styles.item}><button>Centro de Información</button></div>
                    <div className={styles.item}><button>Alianzas con el TECNM León</button></div>
                    <div className={styles.item}><button>CETECH</button></div>
                    <div className={styles.item}><button>Actividades Extraescolares</button></div>
                    <div className={styles.item}><button>Idiomas</button></div>
                    <div className={`${styles.item} ${styles.login}`}>
                        <div className={styles.vSpacer}></div>
                        <button className={styles.loginButton} onClick={()=>navigate("/login")}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <img src="" alt=""/>
                </div>
                <div className={styles.body}>
                    <div className={styles.box}>
                        <div className={styles.item}>
                            <h3>Módulos</h3>
                            <ul>
                                <li>Residencias</li>
                                <li>Reportes Académicos</li>
                                <li>Horario y Materias</li>
                                <li>Examenes psicométricos</li>
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <h3>Información</h3>
                            <ul>
                                <li>Conoce nuestros docentes</li>
                                <li><Link to="/tecnoblog">TecnoBlog</Link></li>
                                <li><Link to="/tutorias">Grupos de Tutorias</Link></li>
                                <li><Link to="/calendario">Calendario Escolar</Link></li>
                                <li>Temarios</li>
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <h3>Conoce tu campus</h3>
                            <ul>
                                <li>
                                    <h4>Croquis</h4>
                                    <ul>
                                        <li>Campus I</li>
                                        <li>Campus II</li>
                                    </ul>
                                </li>
                                <li>Directorio</li>
                                <li>
                                    <h4>Redes Sociales</h4>
                                    <ul>
                                        <li>Instagram</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <h3>Chatbot</h3>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <p>
                        © Tecnológico Nacional. All Rights Reserved 2023
                        <a href="https://www.gob.mx/terminos" target="_blank">Terms & Conditions</a>
                    </p>
                </div>
            </div>
        </div>
    )
}