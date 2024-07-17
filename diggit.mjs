#!/usr/bin/env node

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // Ensure OPENAI_API_KEY environment variable is set
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { ollama } from "ollama-ai-provider";
import { homedir } from "node:os";

let config = {
  openai_model: process.env.OPENAI_API_MODEL || "gpt-4o",
  openai_api_key: process.env.OPENAI_API_KEY,
  ollama_model: process.env.OLLAMA_MODEL || "llama3" // or mistral as default?
};

try {
  config = {
    ...config,
    ...JSON.parse(
      readFileSync(new URL(`${homedir()}/.diggit.json`, import.meta.url))
    )
  };
} catch (e) {
  if (String(e).includes("SyntaxError")) {
    console.error(e);
  }
}

async function prompt(command, relevantFiles = []) {
  let relevantFilesPrompt =
    relevantFiles.length > 0
      ? `We have the following files in a git repo:\n\n${relevantFiles.join(
          ","
        )}\n\n`
      : "";

  let model = null;

  if (config.openai_api_key && config.openai_model) {
    model = openai(config.openai_model);
  } else if (config.ollama_model) {
    model = ollama(config.ollama_model);
  } else {
    console.error("No model found. Please set OPENAI_API_KEY or OLLAMA_MODEL");
    process.exit(1);
  }

  const { text } = await generateText({
    model,
    prompt: `${relevantFilesPrompt}Please generate and return only the git command for: ${command.trim()}`
  });

  return typeof text !== "string"
    ? ""
    : (text)
        .split(/\n`{1,3}/)[1]
        .replace(/^(bash|shell|sh)/, "")
        .trim();
}

let args = null;
let relevantFiles = [];

for (let arg of process.argv) {
  if (args?.constructor === Array) {
    args.push(arg);
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    let packageJson = JSON.parse(
      readFileSync(new URL("./package.json", import.meta.url))
    );
    console.log(
      `Generates git commands from natural language v${packageJson.version}\nUsage: diggit - Unstage file xyz.js`
    );
  }
  if (arg === "-") {
    args = [];
  }
  if (arg === "--") {
    args = [];
    relevantFiles = process.cwd()
      ? execFileSync("git", ["diff", "--name-only"], {
          stdio: "pipe",
          cwd: process.cwd(),
          encoding: "utf8"
        })
          .split("\n")
          .filter((l) => !!l)
          .slice(0, 80)
      : [];
  }
}

(async () => {
  if (args && args.join("").trim()) {
    let gitCommand = await prompt(args.join(" "), relevantFiles);
    console.log(gitCommand);
  }
})();
