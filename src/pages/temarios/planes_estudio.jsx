import Seccion from "../../assets/templates/seccion/seccion.jsx";
import Decorator from '/src/assets/decorations/decoration_03.svg';
import Decorator2 from '/src/assets/decorations/decoration_02.svg';
import styles from './planes.module.css';

export default function PlanesEstudio() {
    return (
        <Seccion title={"Planes de Estudio"}>
            <div className={styles.content}>
                <div className={styles.titleBox}>
                    <h1>Planes de estudio</h1>
                </div>
                <div className={styles.decorator}>
                    <img src={Decorator} alt="decorator" />
                </div>
                <div className={styles.listsBox}>
                    <ul className={styles.list}>
                        <li>
                            <h2>INGENIERÍA ELECTROMECÁNICA</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>

                        </li>
                        <li>
                            <h2>INGENIERÍA ELECTRÓNICA</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA EN GESTIÓN EMPRESARIAL</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA EN LOGISTICA</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA EN SISTEMAS COMPUTACIONALES</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA EN TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA INDUSTRIAL</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                        <li>
                            <h2>INGENIERÍA MECATRÓNICA</h2>
                            <div className={styles.hSeparator}></div>
                            <div className={styles.cardsBox}>
                                <button className={styles.card}>
                                    <h3>Perfil Profesional</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas Comunes</h3>
                                </button>
                                <button className={styles.card}>
                                    <h3>Asignaturas</h3>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={styles.decorator}>
                    <img src={Decorator2} alt="decorator" />
                </div>
            </div>
        </Seccion>
    )
}