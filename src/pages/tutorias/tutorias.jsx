import styles from './tutorias.module.css'
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import Item from "./item/item.jsx";
import './tutorias.addon.css';
import Decorator1 from '/src/assets/decorations/decoration_02.svg?url';

export default function Tutorias() {

    return (
        <Seccion title="Tutorias">
            <div className={styles.content}>
                <div className={styles.titleBox}>
                    <h1>Grupos de tutorías</h1>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.cardsBox}>
                    <Item title={"Prueba"} current={"0"} description={"Lorem Ipsum"} qty={"0"} instructor={"John Doe"} />
                </div>
                <div className={styles.decorator1}>
                    <img src={Decorator1} alt="Decorator" />
                </div>
                <div className={styles.about}>
                    <button>Dudas</button>
                    <button>Aclaraciones</button>
                </div>
                <div className={styles.hSeparator}></div>
                <div className={styles.footer}></div>
            </div>
        </Seccion>
    )
}