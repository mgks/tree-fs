const { normaliseLines } = require("./normaliser")
const { isFile } = require("./utils")

function parseTree(input) {
  const lines = normaliseLines(input)
  const root = { name: "__root__", type: "folder", children: [] }
  
  // Stack keeps track of [ { node, indent } ]
  const stack = [{ node: root, indent: -1 }]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const nextLine = lines[i + 1]

    // It is a folder IF:
    // 1. It ends with '/' (Explicit)
    // 2. The NEXT line exists AND has a deeper indent (Implicit Parent)
    // 3. It does NOT pass the isFile check (Standard folder)
    
    let isFolder = false
    
    if (line.explicitFolder) {
      isFolder = true
    } else if (nextLine && nextLine.indent > line.indent) {
      // If the next item is indented deeper, THIS item must be a folder to hold it.
      isFolder = true
    } else {
      // Fallback to name-based checking
      isFolder = !isFile(line.name)
    }

    const node = {
      name: line.name,
      type: isFolder ? "folder" : "file",
      children: []
    }

    // Standard stack unwinding
    while (stack.length && line.indent <= stack[stack.length - 1].indent) {
      stack.pop()
    }

    // Add to parent
    const parent = stack[stack.length - 1].node
    parent.children.push(node)

    // Push to stack if folder
    if (isFolder) {
      stack.push({ node, indent: line.indent })
    }
  }

  return root.children
}

module.exports = { parseTree }