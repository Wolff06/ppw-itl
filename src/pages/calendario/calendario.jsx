

import Seccion from "../../assets/templates/seccion/seccion.jsx";
import download from "/src/assets/icons/download.svg";
import styles from "./calendario.module.css";

export default function Calendario() {

    return (
        <Seccion title="Calendario Escolar">
            <div className={styles.content}>
                <h1>Calendarios Oficiales del TecNM</h1>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <h3 className={styles.title}>Calendario Oficial TecNM 2026</h3>
                        <p className={styles.description}>Descarga el calendario oficial para el semestre Enero-Junio 2026</p>
                        <button className={styles.action}><img src={download} alt="Descargar" /></button>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.title}>Calendario Oficial TecNM 2026</h3>
                        <p className={styles.description}>Descarga el calendario oficial para el semestre Enero-Junio 2026</p>
                        <button className={styles.action}><img src={download} alt="Descargar" /></button>
                    </div>
                </div>
            </div>
        </Seccion>
    )
}