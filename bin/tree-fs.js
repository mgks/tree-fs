#!/usr/bin/env node

const fs = require("fs")
const readline = require("readline")
const { parseTree, generateFS } = require("../src")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")

async function readInteractiveInput() {
  console.log("Paste directory tree. Press Enter on an empty line to finish.\n")

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false // This helps handle raw paste streams better
  })

  const lines = []

  for await (const line of rl) {
    // If the line is empty (user hit Enter on a new line), we are done.
    if (line.trim() === "") {
      rl.close()
      break
    }
    lines.push(line)
  }

  return lines.join("\n")
}

async function main() {
  let input = ""

  // Programmatic / CI / file input
  if (args[0] && !args[0].startsWith("--")) {
    try {
      input = fs.readFileSync(args[0], "utf8")
    } catch (err) {
      console.error(`Error reading file: ${args[0]}`)
      process.exit(1)
    }
  }
  // Interactive mode
  else {
    input = await readInteractiveInput()
  }

  if (!input.trim()) {
    console.error("No tree input provided.")
    process.exit(1)
  }

  try {
    const tree = parseTree(input)
    generateFS(tree, process.cwd(), { dryRun })
    
    if (dryRun) {
      console.log("Dry run complete. No files written.")
    } else {
      console.log("✅ Structure created successfully.")
    }
  } catch (error) {
    console.error("Failed to generate structure:", error.message)
    process.exit(1)
  }
}

main()