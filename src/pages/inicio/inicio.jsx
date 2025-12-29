import styles from "./Inicio.module.css";
import {useNavigate, Link} from 'react-router-dom';

export default function Inicio() {
    const navigate= useNavigate();

    return (
        <div className={styles["main-container"]}>
            <div className={styles["main-navbar"]}>
                <input type="checkbox" id="burger-btn" className={styles["burger-btn"]}/>
                <label htmlFor="burger-btn" className={styles["navbar-burger"]}>☰</label>
                <div className={styles["navbar-container"]}>
                    <div className={styles["navbar-item"]}><button>Aula Virtual</button></div>
                    <div className={styles["navbar-item"]}><button>Centro de Información</button></div>
                    <div className={styles["navbar-item"]}><button>Alianzas con el TECNM León</button></div>
                    <div className={styles["navbar-item"]}><button>CETECH</button></div>
                    <div className={styles["navbar-item"]}><button>Actividades Extraescolares</button></div>
                    <div className={styles["navbar-item"]}><button>Idiomas</button></div>
                    <div className={styles["navbar-item"]}>
                        <button className={styles.login} onClick={()=>navigate("/login")}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
            <div className={styles["main-content"]}>
                <div className={styles["main-header"]}>Banner</div>
                <div className={styles["main-body"]}>
                    <div className={styles["body-box"]}>
                        <div className={styles["box-item"]}>
                            <h3>Módulos</h3>
                            <ul>
                                <li>Residencias</li>
                                <li>Reportes Académicos</li>
                                <li>Horario y Materias</li>
                                <li>Examenes psicométricos</li>
                            </ul>
                        </div>
                        <div className={styles["box-item"]}>
                            <h3>Información</h3>
                            <ul>
                                <li>Conoce nuestros docentes</li>
                                <li><Link to="/tecnoblog">TecnoBlog</Link></li>
                                <li><Link to="/tutorias">Grupos de Tutorias</Link></li>
                                <li>Calendario Escolar</li>
                                <li>Temarios</li>
                            </ul>
                        </div>
                        <div className={styles["box-item"]}>
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
                        <div className={styles["box-item"]}>
                            <h3>Chatbot</h3>
                        </div>
                    </div>
                </div>
                <div className={styles["main-footer"]}>
                    <p>
                        © Tecnológico Nacional. All Rights Reserved 2023
                        <a href="https://www.gob.mx/terminos" target="_blank">Terms & Conditions</a>
                    </p>
                </div>
            </div>
        </div>
    )
}