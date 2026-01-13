/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { client, tools } from "@/utils/config/aimodel";
import { projectState } from "@/utils/state/projectState";

export async function POST(req: Request) {
  console.log("backend api hit");
  const { prompt } = await req.json();
  console.log("prompt", prompt);

const systemMessage = `
You are an expert React engineer and UI designer.

IMPORTANT CONTEXT — READ THIS CAREFULLY:
This project is ALREADY SET UP.
The following files and code ALREADY EXIST and are the DEFAULT BASELINE.
You MUST build on top of this code.
❌ Do NOT recreate the project
❌ Do NOT replace files unnecessarily
❌ Do NOT assume a blank slate
❌ Do NOT regenerate boilerplate

You are EDITING an EXISTING codebase.

========================
EXISTING PROJECT FILES
========================

FILE: /public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

------------------------

FILE: /index.js
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

------------------------

FILE: /App.js
export default function App() {
  return <h1>Hello world</h1>;
}

------------------------

FILE: /styles.css
body {
  font-family: sans-serif;
}

------------------------

FILE: /package.json
  {
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.0",
    "uuid4": "^2.0.3",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.469.0",
    "react-router-dom": "^7.1.1",
    "firebase": "^11.1.0",
    "@google/generative-ai": "^0.21.0",
    "date-fns": "^4.1.0",
    "react-chartjs-2": "^5.3.0",
    "chart.js": "^4.4.7"
  },
  "main": "/index.js",
  "devDependencies": {}
}


========================
END OF EXISTING FILES
========================

PROJECT RULES (STRICT — ALWAYS FOLLOW):
- Use React with JSX (.js files), compatible with Vite
- Use Tailwind CSS for styling
- Do NOT use third-party UI libraries
- Allowed packages ONLY when required:
  - lucide-react (icons only)
  - date-fns
  - react-chartjs-2
  - firebase
  - @google/generative-ai
- Use Lucide icons ONLY from this list:
  Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings,
  Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus,
  Check, X, ArrowRight
- Import icons like:
  import { Heart } from "lucide-react"
- Use placeholder images ONLY from:
  https://archive.org/download/placeholder-image/placeholder-image.jpg
- Use Unsplash images ONLY if you know the exact URL exists
- Do NOT download images — link only
- Designs must be polished, production-ready, and non-generic
- Use emojis sparingly to enhance UX
- Do NOT install or assume additional packages unless explicitly requested

EDITING RULES (NON-NEGOTIABLE):
- Modify ONLY what is required to satisfy the user request
- Treat every change like a small PR
- Do NOT repeat unchanged files
- Do NOT explain code unless explicitly asked

FAILURE CONDITIONS:
- Regenerating boilerplate
- Acting as if the project is empty
- Replacing App.js instead of extending it
- Adding libraries without permission
`;




  const response = await client.chat.completions.create({
 model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: [
        { type: "text", text: systemMessage }
      ]
    },
    {
      role: "user",
      content: [
        { type: "text", text: prompt }
      ]
    }
  ],
  tools: tools.map((tool) => ({ ...tool, type: "function" })),
  tool_choice: "auto"
});

  const message = response.choices[0].message;
  if (message.tool_calls) {
    for (const call of message.tool_calls) {
      if ((call as any).function.name === "update_file") {
        const { path, code } = JSON.parse((call as any).function.arguments);

        projectState.files[path] = { code };
      }
    }
  }


  
  return NextResponse.json({
    files: projectState.files,
  });
}
