import fs from "fs";
import path from "path";
import ollama from "ollama";

function validateInputs(category, questionFile, validCategories) {
  if (!validCategories.includes(category)) {
    throw new Error("Invalid category! Choose between: academic, creative, professional, technical, marketing.");
  }
  if (!questionFile || !/^q\d+\.txt$/.test(questionFile)) {
    throw new Error("Invalid question file! Specify a file like q1.txt, q2.txt, etc.");
  }
}

function constructPaths(baseFolder, category, fileName) {
  return path.join(baseFolder, category, fileName);
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}
async function queryLLM(question, model = "qwen2:0.5b") {
  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: question }],
  });
  if (!response || !response.message || !response.message.content) {
    throw new Error("Invalid response from the LLM.");
  }
  return response.message.content;
}

async function main() {
  try {
    const category = process.argv[2]?.toLowerCase();
    const questionFile = process.argv[3]?.toLowerCase();

    const validCategories = ["academic", "creative", "professional", "technical", "marketing"];
    validateInputs(category, questionFile, validCategories);

    const categoriesFolder = "./category";
    const ansFolder = "./ans";

    const questionFilePath = constructPaths(categoriesFolder, category, questionFile);
    console.log(`Reading question file: ${questionFilePath}`);
    const questionContent = readFile(questionFilePath);

    const ansCategoryPath = constructPaths(ansFolder, category, "");
    ensureDirectoryExists(ansCategoryPath);

    const answerFiles = fs.readdirSync(ansCategoryPath);
    const nextAnswerFile = `a${answerFiles.length + 1}.txt`;
    const answerFilePath = path.join(ansCategoryPath, nextAnswerFile);

    const answerContent = await queryLLM(questionContent);
    fs.writeFileSync(answerFilePath, answerContent, "utf-8");

    console.log(`Answer saved to: ${answerFilePath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
main();
