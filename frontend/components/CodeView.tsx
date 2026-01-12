"use client";

import React, { useEffect, useState } from "react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import lookup from "@/utils/data/lookup";
import { useChat } from "@/app/context/chatContext";
import axios from "axios";
const CodeView = () => {
  const [activeTab, setActiveTab] = useState(false);
  const [files,setFiles] = useState(lookup.DEFAULT_FILE);
  const {messages} = useChat();

  //console.log('from code view',messages)

const getAiResponse = async () => {
  
   
    const result = await axios.post("api/gen-code", {
      prompt: messages,
    });
    console.log('ai code response',result.data.result);
    const aiRes = result.data.result;
    const mergeFiles = {...lookup.DEFAULT_FILE,...aiRes?.files}
    console.log('merge',mergeFiles)
    setFiles(mergeFiles)
    
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


  console.log('all files',files)


  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-35 gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab(true)}
            className={`text-sm cursor-pointer text-white ${
              activeTab && " bg-blue-500 bg-opacity-25 p-1 px-2  rounded-full"
            } `}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab(false)}
            className={`text-sm cursor-pointer text-white ${
              !activeTab && " bg-blue-500 bg-opacity-25 p-1 px-2  rounded-full"
            } `}
          >
            Preview
          </h2>
        </div>
      </div>

      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...lookup.DEPENDANCY,
          },
        }}
        options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
      >
        <SandpackLayout>
          {activeTab ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview style={{height:"80vh"}} showNavigator={true} />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default CodeView;
