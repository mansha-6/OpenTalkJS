import ollama from "ollama";

async function runChat() {
  try {
    const response = await ollama.chat({
      model: "qwen2:0.5b",
      messages: [{ role: 'user', content: "Write product descriptions" }]
    });

    console.log("Chatbot Response:", response.message.content);
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

runChat();