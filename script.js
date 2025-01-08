// import ollama from "ollama";

// async function runChat() {
//   try {
//     const response = await ollama.chat({
//       model: "qwen2:0.5b",
//       messages: [{ role: 'user', content: "Write product descriptions" }]
//     });

//     console.log("Chatbot Response:", response.message.content);
//   } catch (error) {
//     console.error("Error occurred:", error.message);
//   }
// }

// runChat();


//-----------task-2----------
import fs from "fs"
import ollama from "ollama"

async function runChat() {
  try {
    const inputFilePath = "q.txt"
    const inputContent = fs.readFileSync(inputFilePath, "utf-8")

    const response = await ollama.chat({
      model: "qwen2:0.5b",
      messages: [{ role: "user", content: inputContent }]
    })

    const chatbotResponse = response.message.content

    const outputFilePath = "a.txt"
    fs.writeFileSync(outputFilePath, chatbotResponse, "utf-8")

    console.log("Chatbot response has been saved to a.txt.")
  } catch (error) {
    console.error("Error occurred:", error.message)
  }
}

runChat()