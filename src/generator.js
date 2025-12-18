// src/generator.js
const fs = require("fs")
const path = require("path")

function generateFS(tree, baseDir = process.cwd(), options = {}) {
  const {
    dryRun = false,
    overwrite = false
  } = options

  if (!tree || tree.length === 0) return

  let nodes = tree
  let rootPath = baseDir

  // Intelligent Root Detection:
  // If there is exactly one top-level folder, we treat it as the project root.
  if (nodes.length === 1 && nodes[0].type === "folder") {
    rootPath = path.join(baseDir, nodes[0].name)
    nodes = nodes[0].children
    
    // Create the root directory physically
    if (!dryRun && !fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath, { recursive: true })
    }
  }

  function walk(nodes, currentPath) {
    for (const node of nodes) {
      // Robustness: normalize path separators for cross-platform safety
      const target = path.join(currentPath, node.name)

      if (node.type === "folder") {
        if (!fs.existsSync(target)) {
          if (!dryRun) fs.mkdirSync(target, { recursive: true })
        }
        if (node.children && node.children.length > 0) {
          walk(node.children, target)
        }
      } else {
        // File handling
        if (fs.existsSync(target) && !overwrite) {
          continue
        }
        
        // Ensure parent directory exists (handles cases like "src/utils/helpers.js" as a single line)
        const parentDir = path.dirname(target)
        if (!dryRun && !fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true })
        }

        if (!dryRun) fs.writeFileSync(target, "")
      }
    }
  }

  walk(nodes, rootPath)
}

module.exports = { generateFS }