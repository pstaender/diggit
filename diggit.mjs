#!/usr/bin/env node

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // Ensure OPENAI_API_KEY environment variable is set
import { execFileSync } from 'node:child_process';
import { readFileSync } from "node:fs";

async function main(command, relevantFiles = []) {

  let relevantFilesPrompt = relevantFiles.length > 0 ? `We have the following files in a git repo:\n\n${relevantFiles.join(',')}\n\n` : '';

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `${relevantFilesPrompt}Please generate and return only the git command for: ${command.trim()}`
  });
  return text
    .trim()
    .split('```')[1]
    .replace(/^(bash|shell|sh)/, '')
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
    let packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
    console.log(
      `Generates git commands from natural language v${packageJson.version}\nUsage: diggit - Unstage file xyz.js`
    );
  }
  if (arg === "-") {
    args = [];
  }
  if (arg === "--") {
    args = [];
    relevantFiles = process.cwd() ? execFileSync('git', ['diff', '--name-only'], {
      stdio: 'pipe',
      cwd: process.cwd(),
      encoding: 'utf8',
    }).split("\n").filter(l => !!l).slice(0, 80) : [];
  }
}

(async () => {
  if (args && args.join("").trim()) {
    let gitCommand = await main(args.join(" "), relevantFiles);
    console.log(gitCommand);
  }
})();
