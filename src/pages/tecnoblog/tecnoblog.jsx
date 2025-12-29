import styles from './tecnoblog.module.css';
import {useNavigate} from "react-router-dom";

export default function TecnoBlog() {
    const navigate = useNavigate();

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>
                <button onClick={()=>navigate("/")}>INICIO</button>
                <div className={styles.spacer}></div>
                <h3>TecnoBlog</h3>
            </div>
        </div>
    )
}