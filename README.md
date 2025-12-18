# tree-fs

**tree-fs** is a tiny, zero-dependency Node.js utility that turns text-based directory trees into physical files and folders.

It is designed to be the **standard "Paste & Go" receiver for AI-generated code**.

[![npm version](https://img.shields.io/npm/v/tree-fs.svg)](https://www.npmjs.com/package/tree-fs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## ⚡ Why tree-fs?

LLMs (ChatGPT, Claude, DeepSeek) are great at planning architectures but bad at executing them.
They often output this:

```text
my-app
├── src
│   ├── index.js
│   └── utils.js
└── README.md
```

Copying that structure manually is tedious. **tree-fs** makes it instant.

### Features
*   **AI Compatible:** Strips comments (`# entry point`) and handles weird Markdown formatting.
*   **Deterministic:** Same text input = same file structure. Always.
*   **Safe:** Never overwrites existing files by default.
*   **Smart:** Distinguishes `v1.0` (folder) from `v1.0.js` (file) automatically.
*   **Zero Dependencies:** Installs in seconds.

## 🚀 Usage

### 1. Interactive Mode (The "Paste" Workflow)

Perfect for when ChatGPT gives you a project structure.

```bash
npx tree-fs
```
*(You don't even need to install it!)*

1.  Paste your tree.
2.  Press **Enter twice**.
3.  Done.

### 2. CLI with File Input

Generate structure from a text file saved in your repo.

```bash
tree-fs structure.txt
```

### 3. Programmatic API (For Tool Builders)

Embed `tree-fs` into your own CLIs, generators, or scripts.

```bash
npm install tree-fs
```

```javascript
const { parseTree, generateFS } = require("tree-fs")
const path = require("path")

const treeInput = `
backend-api
├── src
│   ├── controllers/
│   └── models/
└── .env
`

// 1. Parse text into JSON AST
const tree = parseTree(treeInput)

// 2. Generate files at the target directory
generateFS(tree, path.resolve(__dirname, "./output"))

console.log("Structure created!")
```

## 💡 Syntax Guide & Robustness

tree-fs is built to handle the "messy reality" of text inputs.

### 1. Comments are ignored
Great for annotated AI outputs.
```text
src
├── auth.js  # Handles JWT tokens
└── db.js    # Connection logic
```
*Result: Creates `auth.js` and `db.js`. Comments are stripped.*

### 2. Explicit Folders
If a name looks like a file but is actually a folder (e.g., version numbers), end it with a slash `/`.
```text
api
├── v1.5/     <-- Created as a folder
└── v2.0/     <-- Created as a folder
```

### 3. Smart Nesting
If an item has children indented below it, it is **automatically treated as a folder**, even if it has a dot.
```text
app
└── v2.5            <-- Treated as folder because it has a child
    └── migrator.js
```

### 4. Markdown & Symbols
We handle standard tree characters, ASCII art, and bullets.
```text
project
- src
  + components
    > Header.jsx
* public
  - logo.png
```

### 5. Config Files
Known files without extensions are correctly identified as files.
*   `Dockerfile`, `Makefile`, `LICENSE`, `Procfile`, `.gitignore`, `Jenkinsfile`

## 📦 CI/CD Integration

You can use `tree-fs` to scaffold environments in GitHub Actions or pipelines.

```yaml
- name: Scaffold Directory
  run: npx tree-fs structure.txt
```

To test without writing files (Dry Run):
```bash
tree-fs structure.txt --dry-run
```

## License

MIT