"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Colors from "../utils/data/color";
import Lookup from "@/utils/data/lookup";
import { ArrowRight, LoaderCircle } from "lucide-react";
import axios from "axios";
import Markdown from "react-markdown";
import { useChat } from "@/app/context/chatContext";

type Message = {
  role: "user" | "assistant";
  data: string;
};

const ChatView = () => {
  const [userInput, setUserInput] = useState("");
  const { messages, addMessage } = useChat();

  const [loading, setLoading] = useState(false);

  const onGenerate = (input: string) => {
    if (!input.trim()) return;
    addMessage({
    role: "user",
    data: input,
  });

    setUserInput("");
  };

  const getAiResponse = async () => {
    //    const PROMPT = JSON.stringify(messages);
   // console.log("messages", messages);
    setLoading(true);
    const result = await axios.post("api/ai-chat", {
      prompt: messages,
    });
   // console.log(result.data);
    addMessage({
  role: "assistant",
  data: result.data.result,
});

    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        getAiResponse();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  //console.log("messages", messages);
  return (
    <div>
      <div className="relative h-[83vh] flex flex-col">
        <div className="flex-1 overflow-y-scroll scrollbar-hide pl-10">
          {/* messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-3 max-w-xl rounded-lg p-3 bg-gray-100">
              <Markdown>{msg.data}</Markdown>
            </div>
          ))}

          {loading && (
            <div>
              <LoaderCircle className="animate-spin" />
              <h2>Generating Result</h2>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-end ">
          <div className="p-5 border rounded-xl max-w-2xl w-full mt-3">
            <div className="flex gap-2">
              <textarea
                placeholder={Lookup.INPUT_PLACEHOLDER}
                className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
                onChange={(event) => setUserInput(event.target.value)}
                value={userInput}
              />

              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 w-10 h-10 rounded-md cursor-pointer"
              />
            </div>
            <div>{/* <Link  className="h-5 w-5" /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
