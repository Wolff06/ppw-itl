import {loadChatbot, responder} from "../../assets/scripts/chatbot/chatbot.js";
import {useEffect, useId, useState} from "react";
import Seccion from "../../assets/templates/seccion/seccion.jsx";
import styles from './chatbot.module.css';
import usuarioIcon from '../../assets/profesores/usuario_icon.png';
import leonbotImg from '../../assets/icons/leonbot.png';

function isMeaningful(text) {
    // At least one letter or number
    return /[\p{L}\p{N}]/u.test(text);
}

function normalizeInput(text) {
    return text
        .toLowerCase()
        .normalize("NFC")
        .replace(/[^\p{L}\p{N}\s¿?¡!]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}

export default function Chatbot() {
    const [ready, setReady] = useState(false);
    const [response, setResponse] = useState("");
    const [busy, setBusy] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const textBoxId = useId();
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadChatbot().then(() => setReady(true));
    }, []);

    async function handleAsk() {
        if (busy) return;
        setBusy(true);

        try{
            const clean = normalizeInput(message);

            if (!clean) {
                setResponse("Escribe una pregunta 🙂");
                return;
            }

            if (clean.length > 200) {
                setResponse("Tu mensaje es muy largo. Intenta resumirlo.");
                return;
            }

            if(!isMeaningful(clean)){
                setResponse("No entendí eso, ¿Puedes escribirlo de otra forma?");
                return;
            }

            const res = await responder(message);
            setResponse(res);
            setChatHistory(prev=>[...prev,{ question: message, response: response }]);
            setMessage("");
        }finally{
            setBusy(false);
        }
    }

    return (
        <Seccion title={"LeonBot"}>
            <div className={styles.container}>
                <div className={styles.chatBox}>
                    <div className={styles.chatHistory}>
                        <div className={styles.box}>
                            <div className={styles.greet}><img src={leonbotImg}/><p className={styles.answer}>Bienvenido, ¡ingresa tu pregunta!</p></div>
                        </div>
                        {
                            chatHistory.map((item, index) => (
                                <div key={index} className={styles.box}>
                                    <div className={styles.item}><p className={styles.question}>{item.question}</p><img src={usuarioIcon}/></div>
                                    <div className={styles.item}><img src={leonbotImg}/><p className={styles.answer}>{item.response}</p></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.controls}>
                        <input type="textfield" placeholder="Escribe tu pregunta"
                               id={textBoxId} value={message} onChange={e => setMessage(e.target.value)}
                               className={styles.input}/>
                        <button disabled={!ready} onClick={handleAsk} className={styles.send}>→</button>
                    </div>
                </div>
            </div>

        </Seccion>
    );
}