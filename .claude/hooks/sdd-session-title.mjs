#!/usr/bin/env node
import { appendFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const COMMAND_TITLE_PREFIXES = {
  spec: "SDD-SPEC",
  plan: "SDD-PLAN",
  question: "SDD-QUESTION",
  feature: "SDD-FEATURE",
  "review-feature": "SDD-REVIEW",
  "test-plan": "SDD-TEST-PLAN",
  autotest: "SDD-AUTOTEST",
  verify: "SDD-VERIFY",
};

const TASK_ID_PATTERN = /[A-Z][A-Z0-9]{1,9}-\d+/i;

function readHookPayload() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return null;
  }
}

function findTaskIdentifier(promptText) {
  const identifierInPrompt = promptText.match(TASK_ID_PATTERN);
  if (identifierInPrompt) return identifierInPrompt[0].toUpperCase();

  try {
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const identifierInBranch = currentBranch.match(TASK_ID_PATTERN);
    if (identifierInBranch) return identifierInBranch[0].toUpperCase();
  } catch {}
  return null;
}

const hookPayload = readHookPayload();
if (
  !hookPayload?.prompt ||
  !hookPayload?.transcript_path ||
  !hookPayload?.session_id
) {
  process.exit(0);
}

const commandInvocation = hookPayload.prompt.trim().match(/^\/([a-zA-Z-]+)/);
if (!commandInvocation) process.exit(0);

const titlePrefix = COMMAND_TITLE_PREFIXES[commandInvocation[1].toLowerCase()];
if (!titlePrefix) process.exit(0);

const taskIdentifier = findTaskIdentifier(hookPayload.prompt);
const customTitle = taskIdentifier
  ? `${titlePrefix}-${taskIdentifier}`
  : titlePrefix;

try {
  appendFileSync(
    hookPayload.transcript_path,
    `${JSON.stringify({ type: "custom-title", sessionId: hookPayload.session_id, customTitle })}\n`,
    "utf8",
  );
} catch {}
process.exit(0);
