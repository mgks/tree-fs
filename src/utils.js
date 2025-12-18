// src/utils.js

// Common files that have no extension but should be treated as files
const KNOWN_FILES = new Set([
  "LICENSE", "licence",
  "README", "readme",
  "Dockerfile", "dockerfile",
  "Makefile", "makefile",
  "Jenkinsfile",
  "Procfile",
  "CNAME",
  ".gitignore", ".env", ".npmrc", ".dockerignore", ".editorconfig"
])

function isFile(name) {
  // Check exact matches (case-insensitive for safety if needed, but Sets are exact)
  if (KNOWN_FILES.has(name)) return true
  
  // Standard extension check: dot followed by 1-5 chars (e.g., .js, .json, .java)
  // We avoid detecting "v1.2" as a file by ensuring the extension is letters only
  // OR if it ends in specific known formats like .tar.gz
  return /\.[a-zA-Z0-9]{1,10}$/.test(name)
}

module.exports = { isFile }