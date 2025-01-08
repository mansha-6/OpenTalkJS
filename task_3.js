import fs from 'fs';
import ollama from 'ollama';

const n = 3; // Number of questions

// Asynchronous function to interact with LLM and save the response
async function ask_llm(questionContent, index) {
    try {
        const response = await ollama.chat({
            model: "qwen2:0.5b",
            messages: [{ role: "user", content: questionContent }],
        });

        // Extract response content
        const answer = response.message.content;

        // Save response to a file
        fs.writeFileSync(`./Answers/a${index}.txt`, answer);
        console.log(`Answer ${index} saved successfully.`);
    } catch (error) {
        console.error(`Error processing question ${index}:`, error);
    }
}

// Main function to process all questions
for (let i = 1; i <= n; i++) {
    try {
        // Read question content synchronously
        const questionPath = `./Questions/q${i}.txt`;
        const questionContent = fs.readFileSync(questionPath, 'utf8');

        // Pass content to LLM and process response
        await ask_llm(questionContent, i);
    } catch (error) {
        console.error(`Error reading question ${i}:`, error);
    }
}
