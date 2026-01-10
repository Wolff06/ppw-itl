import Seccion from "../../assets/templates/seccion/seccion.jsx";
import {useEffect, useId, useState} from "react";
import { loadChatbot, responder } from "./chatbot.js";

export default function Test(){
    const [ready, setReady] = useState(false);
    const [response, setResponse] = useState("");
    const [busy, setBusy] = useState(false);

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
                setResponse("No entendí eso 🤔 ¿Puedes escribirlo de otra forma?");
                return;
            }

            const res = await responder(message);
            console.log(message);
            setResponse(res);

        }finally{
            setBusy(false);
        }
    }


    return(
        <Seccion title={"Test"}>
            <div style={{ padding: "10px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="textfield" placeholder="Escribe tu pregunta"
                       id={textBoxId} value={message} onChange={e => setMessage(e.target.value)}
                style={{ fontSize: "2rem" }}/>
                <button disabled={!ready} onClick={handleAsk}>
                    Preguntar
                </button>
                <p>{response}</p>
            </div>
        </Seccion>
    )
}

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
