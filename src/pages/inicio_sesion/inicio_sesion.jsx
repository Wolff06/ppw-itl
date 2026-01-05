
import styles from "./InicioSesion.module.css";
import logo from '../../assets/logos/LogoTecNM.png';

export default function InicioSesion() {
    return (
        <div className={styles.content}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <div className={styles.logo}><img src={logo} alt="ITL Logo"/></div>
                    <div className={styles.vSpacer}></div>
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