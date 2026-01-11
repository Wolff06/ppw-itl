import * as tf from "@tensorflow/tfjs";

let model;
let tokenizer;
let labelEncoder;
let intents;

let OOV_INDEX;

export async function loadChatbot() {
    // Load TFJS model
    model = await tf.loadGraphModel("/web_model/model.json");

    // Load tokenizer
    tokenizer = await fetch("/web_model/tokenizer.json").then(res => res.json());
    OOV_INDEX = tokenizer["<OOV>"] ?? 1;
    // Load label encoder
    labelEncoder = await fetch("/web_model/label_encoder.json").then(res => res.json());

    // Load intents
    intents = await fetch("/web_model/PyR.json").then(res => res.json());
}

function textsToSequences(text) {
    const words = normalize(text).split(/\s+/);
    return words.map(word => tokenizer[word] ?? OOV_INDEX);
}

function padSequence(seq, maxLen = 20) {
    if (seq.length > maxLen) {
        return seq.slice(0, maxLen);
    }
    return [...seq, ...Array(maxLen - seq.length).fill(0)];
}

export async function responder(pregunta) {
    if (!model || !tokenizer || !labelEncoder || !intents) {
        throw new Error("Chatbot not initialized. Call loadChatbot() first.");
    }

    // 1. text → sequence
    const seq = textsToSequences(pregunta);

    // 2. padding
    const padded = padSequence(seq);

    let prediction;

    tf.tidy(() => {
        const input = tf.tensor2d([padded], [1, 20], "float32");
        prediction = tf.keep(model.predict(input));
    });

    const predArray = await prediction.array();
    prediction.dispose();

    const probs = predArray[0];
    const maxProb = Math.max(...probs);
    console.log(maxProb);

    const index = predArray[0].indexOf(Math.max(...predArray[0]));
    const tag = labelEncoder[index];

    const intent = intents.intents.find(i => i.tag === tag);
    if (!intent) return "No entendí tu pregunta.";

    return intent.responses[
        Math.floor(Math.random() * intent.responses.length)
        ];
}

function normalize(text) {
    return text
        .toLowerCase();
}

