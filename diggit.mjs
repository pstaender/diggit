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

function relevantFilesPrompt(relevantFiles) {
  return relevantFiles.length > 0
    ? `We have the following files in a git repo:\n\n${relevantFiles.join(
        ","
      )}\n\n`
    : "";
}

async function prompt(promptMessage) {
  let model = null;

  if (config.openai_api_key && config.openai_model) {
    model = openai(config.openai_model);
  } else if (config.ollama_model) {
    model = ollama(config.ollama_model);
  } else {
    console.error("No model found. Please set OPENAI_API_KEY or OLLAMA_MODEL");
    process.exit(1);
  }

  let { text } = await generateText({
    model,
    prompt: promptMessage
  });

  // console.error({promptMessage, text})

  if (typeof text !== "string") {
    return "";
  }
  if (text.match(/`{1,3}/)) {
    return text
      .split(/`{1,3}/)[1]
      .replace(/^(bash|shell|sh)/, "")
      .trim();
  }
  return text.trim();
}

let argsAfterHyphens = null;
let relevantFiles = [];
let generateCommitMessage = false;

for (let arg of process.argv) {
  if (argsAfterHyphens?.constructor === Array) {
    argsAfterHyphens.push(arg);
    continue;
  }

  if (!argsAfterHyphens) {
    if (arg === "--help" || arg === "-h") {
      let packageJson = JSON.parse(
        readFileSync(new URL("./package.json", import.meta.url))
      );
      console.log(
        `Generates git commands from natural language v${packageJson.version}\nUsage: diggit - Unstage file xyz.js\n\nOptions:\n  -h, --help\t\tShow help\n  -m, --message\t\tGenerate commit message\n  --\t\t\tGenerate git command from natural language with relevant files as context\n  -\t\t\tGenerate git command from natural language`
      );
      process.exit(0);
    }
    if (arg === "--message" || arg === "-m") {
      generateCommitMessage = true;
    }
  }

  if (arg === "-") {
    argsAfterHyphens = [];
  }

  if (arg === "--") {
    argsAfterHyphens = [];
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
  if (
    argsAfterHyphens &&
    argsAfterHyphens.length > 0 &&
    argsAfterHyphens.join("").trim()
  ) {
    let command = argsAfterHyphens.join(" ");
    if (generateCommitMessage) {
      if (relevantFiles.length === 0 && command.trim() === "") {
        command = "Please make a very short and descriptive commit message.";
      } else {
        command = `Please transform the following text to a very short and descriptive commit message:\n\n${command}`;
      }
    } else {
      command = `Please generate and return only the git command for:\n\n${command}`;
    }

    console.log(
      await prompt(
        [relevantFilesPrompt(relevantFiles), command]
          .filter((v) => !!v.trim())
          .join("\n")
      )
    );
  }
})();
