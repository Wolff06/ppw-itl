
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import { useNavigate } from 'react-router-dom';
import styles from './tecnoblog.module.css';
import inicioIcon from '../../assets/icons/inicio.png';
import credsspImg from '../../assets/foro/CREDSSP.jpg';
import mlImg from '../../assets/foro/Machin_Learning.webp';
import iaSeguridadImg from '../../assets/foro/ia_ciberseguridad.jpg';

export default function TecnoBlog() {
    const navigate = useNavigate();

    return (
        <Seccion title="TecnoBlog">
            <div>
                {/* Navbar */}
                <div className={styles.navbar}>
                    <div className={styles.navLogo}>
                        <button 
                            onClick={() => navigate('/inicio')}
                            className={styles.homeButton}
                            aria-label="Regresar al inicio"
                        >
                            <img src={inicioIcon} alt="Inicio" />
                        </button>
                    </div>
                    <div className={styles.navTitle}>TecnoBlog</div>
                </div>

                {/* Contenido principal */}
                <div className={styles.contenido}>
                    {/* Columna 1 */}
                    <div className={styles['cont-column']}>
                        <h1>CÓMO SOLUCIONAR CREDSSP EN SERVIDOR</h1>
                        <ol>
                            <li>
                                Épocas en aprendizaje automático (Keras/TensorFlow):
                                <ul>
                                    <li>Se define como el número de veces que el modelo recorre todo el conjunto de datos de entrenamiento.</li>
                                    <li><strong>Ejemplo:</strong> model.fit(X_train, y_train, epochs=10)</li>
                                </ul>
                            </li>
                            
                            <li>
                                Época Unix (timestamp):
                                <ul>
                                    <li>Representa el número de segundos desde el 1 de enero de 1970.</li>
                                    <li><strong>Ejemplo:</strong> epoch_time = time.time()</li>  
                                </ul>
                            </li>
                            <li>
                                Convertir época Unix a fecha legible:
                                <ul>
                                    <li>Utiliza datetime.fromtimestamp(epoch_time) para obtener una fecha legible.</li>
                                    <li><strong>Ejemplo:</strong> dt_object = datetime.datetime.fromtimestamp(epoch_time)</li>
                                </ul>
                            </li>
                        </ol>
                        <img src={credsspImg} alt="Código CREDSSP" />
                    </div>

                    {/* Columna 2 */}
                    <div className={styles['cont-column']}>
                        <img src={mlImg} alt="Machine Learning" />
                        <h1>Inteligencia Artificial y Machine Learning en Bases de Datos</h1>
                        <h2>Investigación sobre el Uso de Inteligencia Artificial y Machine Learning en Bases de Datos</h2>
                        <h3>¿Qué son?</h3>
                        <p>La inteligencia artificial (IA) y el aprendizaje automático (machine learning, ML) son disciplinas que permiten a los sistemas informáticos identificar patrones en datos masivos y elaborar predicciones sin intervención humana. En el contexto de bases de datos, estas herramientas mejoran la eficiencia en la gestión y el análisis de la información.
                            El término "Machine Learning" se utilizó por primera vez en 1959, pero su relevancia ha crecido con el aumento de la capacidad computacional y el auge del Big Data. Los algoritmos de ML se dividen en tres categorías principales:
                        </p>
                        <ul>
                            <li><strong>Aprendizaje supervisado:</strong> Basado en datos etiquetados para hacer predicciones precisas, como en los filtros de spam.</li>
                            <li><strong>Aprendizaje no supervisado:</strong> Identifica patrones en datos sin etiquetas previas, útil en segmentación de mercados.</li>
                            <li><strong>Aprendizaje por refuerzo:</strong> Algoritmos que aprenden mediante prueba y error, aplicado en reconocimiento facial y diagnóstico médico.</li>
                        </ul>
                    </div>

                    {/* Columna 3 */}
                    <div className={styles['cont-column']}>
                        <h1>La detección de anomalías impulsada por IA será clave para enfrentar nuevas ciberamenazas</h1>
                        <h2>Predicciones de ciberseguridad para 2025 según WatchGuard</h2>
                        
                        <p>Las ciberamenazas impulsadas por el mal uso de la inteligencia artificial (IA), el malware y el fraude basado en deepfakes e ingeniería social prometen ser algunas de las tendencias de este 2025 en ciberseguridad. A estas tendencias, WatchGuard suma la dualidad de la IA, la falta de interés de los profesionales por asumir el rol del CISO y la colaboración entre organizaciones.</p>
                        
                        <p>Teniendo en cuenta los constantes cambios en el sector de la tecnología y la ciberseguridad, los expertos de WatchGuard han elaborado seis predicciones para el próximo año con el fin de informar y de advertir a los usuarios.</p>
                        
                        <h3>El doble uso de la IA en 2025</h3>
                        
                        <p>La primera predicción para este 2025 es que los sistemas de IA multimodal serán aprovechados para automatizar la cadena de un ciberataque. Por tanto, se espera que aumente:</p>
                        
                        <ul>
                            <li><strong>Creación de perfiles falsos</strong> en las redes sociales</li>
                            <li><strong>Desarrollo de contenido realista de phishing</strong>, incluido el contenido de vishing</li>
                            <li><strong>Descubrimiento de exploits</strong> de día cero</li>
                            <li><strong>Despliegue de malware generado</strong> para eludir la detección en endpoints</li>
                        </ul>
                        
                        <p>Esto impactará en las organizaciones independientemente de su tamaño, que se enfrentarán a un aumento de las ciberamenazas altamente personalizadas que serán difíciles de detectar y combatir.</p>
                        
                        <h3>Nuevos vectores de ataque con IA generativa</h3>
                        
                        <p>En cuanto a la segunda predicción, los ciberdelincuentes sacarán provecho de la IA generativa (GenAI) que abrirá nuevos vectores de ataque, combinando GenAI con otras tácticas sofisticadas para ganarse la confianza de las organizaciones y realizar lo que creen que es una transacción comercial legítima.</p>
                        
                        <h3>La dualidad de la IA en defensa</h3>
                        
                        <p>La tercera predicción relacionada con la IA reside en su dualidad, pues los profesionales aprovecharán sus capacidades para descubrir y frustrar los intentos de ataque. De hecho, los equipos de ciberseguridad:</p>
                        
                        <ul>
                            <li>Confiarán menos en las capacidades defensivas tradicionales</li>
                            <li>Implementarán más controles de detección de anomalías impulsados por la IA</li>
                        </ul>
                        
                        <img src={iaSeguridadImg} alt="IA en ciberseguridad" />
                    </div>
                </div>
            </div>
        </Seccion>
    );
}