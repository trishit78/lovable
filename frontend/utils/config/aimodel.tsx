import OpenAI from "openai";
import PROMPT from "../data/prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type IncomingMessage = {
  role: "user" | "assistant";
  data: string;
};

export async function sendChatMessage(messages: IncomingMessage[]) {
  const data = [""];
  console.log("messages", messages);
  messages.forEach((msg) => {
    //console.log('the data will be going to the ai',msg.data);
    data.push(msg.data);
    console.log("data", data);
  });
  const userInput = messages[messages.length - 1]?.data;

  if (!userInput) {
    throw new Error("No user input provided");
  }

  const dataString = JSON.stringify(data);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: PROMPT.CHAT_PROMPT,
      },
      {
        role: "user",
        content: dataString,
      },
    ],

    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 1200,
    presence_penalty: 0.2,
    frequency_penalty: 0.2,
  });

  return response.choices[0].message.content;
}

export async function generateCode(messages: IncomingMessage[]) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages must be a non-empty array");
  }

  // ✅ ONLY take the latest user intent
  const lastUserMessage = messages
    .slice()
    .reverse()
    .find((m) => m.role === "user");

  if (!lastUserMessage) {
    throw new Error("No user instruction found");
  }
console.log('last user messages',lastUserMessage)
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: PROMPT.CODE_GEN_PROMPT,
      },
      {
        role: "user",
        content: lastUserMessage.data, // ✅ plain English
      },
    ],

    // 🔒 STRICT JSON OUTPUT
    response_format: { type: "json_object" },

    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 2500,
  });

  return response.choices[0].message.content;
}
