import fs from 'fs';
import ollama from 'ollama';

let q;
let n = 3;

async function query_LLM(q, i) {
    const response = await ollama.chat({
        model: "qwen2:0.5b",
        messages: [{ role: "user", content: q }],
    });
        let a = response.message.content;
    
    if (!a) {
        a = `Answer to question ${i}: No response from model.`; // Fallback answer if empty
    }
    fs.writeFile(`./Answers/a${i}.txt`, a, (err) => {
        if (err) {
            throw err;
        } else {
            console.log(`Answer ${i} is given`);
        }
    });
}

for (let i = 1; i <= n; i++) {
    q = `./Questions/q${i}.txt`;
        const questionContent = fs.readFileSync(q, 'utf8');
        query_LLM(questionContent, i);
}
