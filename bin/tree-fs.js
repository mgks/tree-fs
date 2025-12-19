#!/usr/bin/env node

const fs = require("fs")
const readline = require("readline")
const { parseTree, generateFS } = require("../src")
const pkg = require("../package.json")

const args = process.argv.slice(2)

// --- Flag Handling ---
if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version)
  process.exit(0)
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  Usage: tree-fs [file] [options]

  Generate a real file system from a text-based directory tree.

  Arguments:
    file           Text file containing the tree.
                   If ignored, reads from STDIN or Interactive Mode.

  Options:
    -h, --help     Show this help message
    -v, --version  Show version number
    --dry-run      Simulate execution without writing files

  Examples:
    npx tree-fs                    # Interactive mode
    npx tree-fs structure.txt      # From file
    cat tree.txt | npx tree-fs     # From pipe
`)
  process.exit(0)
}

const dryRun = args.includes("--dry-run")

// --- Helper: Read from Piped Stdin (Non-Interactive) ---
async function readPipedInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  const lines = []
  for await (const line of rl) {
    lines.push(line)
  }
  return lines.join("\n")
}

// --- Helper: Read from Interactive Prompt ---
async function readInteractiveInput() {
  console.log("Paste directory tree. Press Enter on an empty line to finish.\n")

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  const lines = []
  for await (const line of rl) {
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
  const fileArg = args.find(arg => !arg.startsWith("-"))

  // 1. File Argument Provided
  if (fileArg) {
    try {
      input = fs.readFileSync(fileArg, "utf8")
    } catch (err) {
      console.error(`Error reading file: ${fileArg}`)
      process.exit(1)
    }
  } 
  // 2. Piped Input (Unix Style)
  else if (!process.stdin.isTTY) {
    input = await readPipedInput()
  }
  // 3. Interactive Mode (Human)
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

    // Minimal feedback for pipes/dry-run, success message for humans
    if (dryRun) {
      console.log("Dry run complete. No files written.")
    } else if (process.stdin.isTTY) {
      console.log("✅ Structure created successfully.")
    }
  } catch (error) {
    console.error("Failed to generate structure:", error.message)
    process.exit(1)
  }
}

main()