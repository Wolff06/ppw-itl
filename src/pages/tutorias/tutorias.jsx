import styles from './tutorias.module.css'
import {useNavigate} from "react-router-dom";

export default function Tutorias() {
    const navigate = useNavigate();

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>
                <button onClick={()=>navigate("/")}>INICIO</button>
                <div className={styles.spacer}></div>
                <input type="checkbox" id="check" className={styles.checkbox}/>
                <label htmlFor="check">☰</label>
                <h3>GRUPOS DE TUTORÍA</h3>
                <div className={styles.menu}>
                    <button>Aclaraciones</button>
                    <button>Preguntas</button>
                </div>
            </div>
            <div className={styles.tutorBox}>
                <h2>GRUPOS DE TUTORIA</h2>
                <h3>ENERO - JUNIO 2025</h3>
                <div className={styles.tutorCards}>
                    <div className={styles.card}>
                        <h3>CALCULO DIFERENCIAL</h3>
                        <p>4 espacios disponibles</p>
                        <ul>
                            <li>Lunes a Viernes</li>
                            <li>10:30 - 11:30 AM</li>
                            <li>Sala Alfombrada</li>
                            <li>Impartido por: </li>
                            <li>17 alumnos inscritos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}