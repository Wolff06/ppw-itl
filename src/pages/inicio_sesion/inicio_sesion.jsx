
import styles from "./InicioSesion.module.css";

export default function InicioSesion() {
    return (
        <div className={styles["main-content"]}>
            <div className={styles["login-box"]}>
                <div className={styles.header}>
                    <h3>INSTITUTO TECNOLÓGICO DE LEÓN</h3>
                </div>
                <div className={styles.body}>
                    <h3>INICIAR SESIÓN</h3>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="E-mail" required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Password" required />
                    </div>
                    <div className={`${styles.field} ${styles.loginBtn}`}>
                        <button>Ingresar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}