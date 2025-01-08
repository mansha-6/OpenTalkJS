import fs from "fs";
import ollama from "ollama";

const inputFilePath = "q.txt";
const outputFilePath = "a.txt";

function processChat() {
  fs.readFile(inputFilePath, "utf-8", (readErr, inputContent) => {
    if (readErr) {
      if (readErr.code === "ENOENT") {
        console.error(`File not found: ${readErr.path}`);
      } else if (readErr.code === "EACCES") {
        console.error(`Permission denied: ${readErr.path}`);
      } else {
        console.error("Error reading file:", readErr.message);
      }
      return;
    }
    ollama
      .chat({
        model: "qwen2:0.5b",
        messages: [{ role: "user", content: inputContent }],
      })
      .then((response) => {
        if (!response || !response.message || !response.message.content) {
          throw new Error("Invalid response from the chatbot model.");
        }

        const chatbotResponse = response.message.content;

        fs.writeFile(outputFilePath, chatbotResponse, "utf-8", (writeErr) => {
          if (writeErr) {
            if (writeErr.code === "EACCES") {
              console.error(`Permission denied: ${writeErr.path}`);
            } else {
              console.error("Error writing file:", writeErr.message);
            }
            return;
          }
          console.log("Chatbot response has been saved to a.txt.");
        });
      })
      .catch((err) => {
        console.error("Error occurred during chatbot processing:", err.message);
      });
  });
}

processChat();
