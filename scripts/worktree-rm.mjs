#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { platform } from "node:process";

const opts = platform === "win32" ? { shell: true } : {};

const id = process.argv[2];
if (!id) {
  console.error("Uso: npm run worktree:rm -- <ID>");
  process.exit(1);
}

const { worktrees } = JSON.parse(
  execFileSync("worktree", ["ls", "--json"], { encoding: "utf8", ...opts }),
);

if (!worktrees.some((w) => w.id === id)) {
  console.error(`Worktree "${id}" não encontrado. Worktrees existentes:\n`);
  spawnSync("worktree", ["ls"], { stdio: "inherit", ...opts });
  process.exit(1);
}

const result = spawnSync("worktree", ["rm", id, ...process.argv.slice(3)], {
  stdio: "inherit",
  ...opts,
});
process.exit(result.status ?? 1);
