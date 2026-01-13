
import styles from './seccion.module.css';
import {useNavigate} from "react-router-dom";
import Home from '/src/assets/icons/outline-home.svg?url';
import ProtectedRoute from "../../scripts/serverless/protectedRoute.jsx";

export default function Seccion({children, title}) {
    const navigate = useNavigate();

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button onClick={()=>navigate("/inicio")}
                            className={styles.home}><img src={Home} alt="Inicio"/></button>
                    <div className={styles.vSpacer}></div>
                    <div className={styles.title}><h1>{title}</h1></div>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    )
}