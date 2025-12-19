#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const readline = require("readline")
const { parseTree, generateFS } = require("../src")
const pkg = require("../package.json")

const args = process.argv.slice(2)

// Standard Flags
if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version)
  process.exit(0)
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  Usage: tree-fs [file] [options]

  Generate a real file system from a text-based directory tree.

  Arguments:
    file           Text file containing the tree (optional)
                   If ignored, tree-fs runs in interactive mode.

  Options:
    -h, --help     Show this help message
    -v, --version  Show version number
    --dry-run      Simulate execution without writing files

  Examples:
    npx tree-fs                    # Interactive mode
    npx tree-fs structure.txt      # Generate from file
    npx tree-fs doc.md --dry-run   # Preview changes
`)
  process.exit(0)
}

const dryRun = args.includes("--dry-run")

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

  // 1. Check for file input (Any arg that isn't a flag)
  const fileArg = args.find(arg => !arg.startsWith("-"))

  if (fileArg) {
    try {
      input = fs.readFileSync(fileArg, "utf8")
    } catch (err) {
      console.error(`Error reading file: ${fileArg}`)
      console.error(err.message)
      process.exit(1)
    }
  } 
  // 2. Interactive Mode
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