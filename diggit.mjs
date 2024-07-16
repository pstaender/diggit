#!/usr/bin/env node

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // Ensure OPENAI_API_KEY environment variable is set

async function main(command) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Please generate and return only the git command for: ${command.trim()}`
  });
  return text
    .trim()
    .replace(/^```(bash|sh|shell)/, "")
    .replace(/```$/, "")
    .trim();
}

let args = null;

for (let arg of process.argv) {
  if (args?.constructor === Array) {
    args.push(arg);
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    console.log(
      `Type your git issue and get the command to get it done (c) philipp staender 2024\nUsage: diggit Unstage file xyz.js`
    );
  }
  if (arg === "-") {
    args = [];
  }
}

(async () => {
  if (args && args.join("").trim()) {
    let gitCommand = await main(args.join(" "));
    console.log(gitCommand);
  }
})();
