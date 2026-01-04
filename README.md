# tree-fs

**`tree-fs` is a tiny, zero-dependency Node.js utility that turns text-based directory trees into physical files and folders.**

<p>
  <img src="https://img.shields.io/npm/v/tree-fs.svg?style=flat-square&color=d25353" alt="npm version">
  <img src="https://img.shields.io/bundlephobia/minzip/tree-fs?style=flat-square&color=38bd24" alt="size">
  <img src="https://img.shields.io/npm/dt/tree-fs.svg?style=flat-square&color=success&color=38bd24" alt="npm downloads">
  <img src="https://img.shields.io/github/license/mgks/tree-fs.svg?style=flat-square&color=blue" alt="license">
</p>

<img width="720" src="https://github.com/mgks/tree-fs/blob/main/preview.gif?raw=true">

LLMs (ChatGPT, Claude, DeepSeek) are great at planning architectures but bad at executing them.

They often output this:

```bash
my-app
├── src
│   ├── index.js
│   └── utils.js
└── README.md
```

Copying that structure manually is tedious. **tree-fs** makes it instant. It is designed to be the **standard "Paste & Go" receiver for AI-generated code**.

## Features
*   **AI Compatible:** Strips comments, emojis, and weird formatting automatically.
*   **Deterministic:** Same text input = same file structure. Always.
*   **Safe:** Never overwrites existing files by default.
*   **Smart:** Distinguishes `v1.0` (folder) from `v1.0.js` (file) automatically.
*   **Zero Dependencies:** Installs in seconds.

## Usage

### Interactive Mode (The "Paste" Workflow)
Perfect for when ChatGPT gives you a project structure.

```bash
npx tree-fs
```
1.  Paste your tree.
2.  Press **Enter twice**.

### CLI with File Input
Generate structure from a text file saved in your repo.

```bash
tree-fs structure.txt
```

### Unix Piping (Stdin)
Pipe content directly for automation.

```bash
cat structure.txt | tree-fs      # From file
pbpaste | tree-fs                # From clipboard (macOS)
echo "src/\n index.js" | tree-fs # Echo directly
```

### Programmatic API
Embed `tree-fs` into your own CLIs or scripts.

```javascript
const { parseTree, generateFS } = require("tree-fs")

const tree = parseTree(`
src
├── index.js
└── utils/
`)

generateFS(tree, process.cwd())
```

## Robustness & Syntax

tree-fs is built to handle the "messy reality" of text inputs. It creates the structure you *intend*, not just what you *type*.

### Noise Cleaning (Comments & Rich Text)
We automatically strip comments, indicators, and "decorative" emojis often added by AI models.

```bash
project
├── 📁 src 🚀         <-- Leading/Trailing emojis stripped
│   ├── main.js       (Core Logic)  <-- Explanations stripped
│   └── theme.css     // Dark Mode  <-- Comments stripped
└── .env              # Do not commit
```
*Result: Clean folder `src` and files `main.js`, `theme.css`, `.env`.*

### Flexible Formats
We support standard trees, ASCII art, and mixed indentation.
```bash
project
├── standard-style
+-- ascii-style
|-- legacy-style
  └── space-indentation
```

### Smart Folder Detection
*   **Explicit:** Ends in slash (`v1.0/` → Folder).
*   **Implicit:** Has children (`v1.0` containing files → Folder).
*   **Files:** Known configs (`Dockerfile`, `Makefile`, `LICENSE`) are treated as files even without extensions.

### Copy-Paste Resilience
If you copy a partial tree and miss the vertical pipe (`── folder` instead of `├── folder`), or accidentally indent lines with extra spaces, `tree-fs` automatically detects and aligns them to the correct root.

## The AI Workflow

To get the perfect output from ChatGPT, Claude, or DeepSeek, add this to your system prompt:

> "When asked to generate project directory structures, output them as a plain text tree diagram. Do not use code blocks for creation commands."

Then simply copy the output and run `npx tree-fs`.

## CI/CD Integration

```yaml
- name: Scaffold Directory
  run: npx tree-fs structure.txt
```

## License

MIT

> **{ github.com/mgks }**
> 
> <a href="https://mgks.dev"><img src="https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev"></a> <a href="https://github.com/sponsors/mgks"><img src="https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks"></a>
