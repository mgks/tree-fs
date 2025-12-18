// src/normaliser.js

// 1. Expanded Regex to catch +, >, and markdown bullets
const STRIP_REGEX = /^[\s│├└─•*|\-+>]+/

function normaliseLines(input) {
  return input
    .split("\n")
    .map(line => line.replace(/\r/g, ""))
    .filter(Boolean)
    .map(raw => {
      // 2. Detect indentation based on prefix length
      const match = raw.match(STRIP_REGEX)
      const prefixLength = match ? match[0].length : 0
      
      // 3. Strip comments (anything after ' #')
      // We explicitly look for " #" so we don't break "page#1.js"
      const commentIndex = raw.indexOf(" #")
      let cleaned = commentIndex !== -1 ? raw.substring(0, commentIndex) : raw

      // 4. Check for explicit trailing slash (User saying "This is a folder/")
      const endsWithSlash = cleaned.trim().endsWith("/")

      cleaned = cleaned
        .replace(STRIP_REGEX, "") // Remove tree characters
        .replace(/\/$/, "")       // Remove that trailing slash for the name
        .trim()

      return {
        raw,
        indent: prefixLength,
        name: cleaned,
        explicitFolder: endsWithSlash // Pass this signal to the parser
      }
    })
    .filter(line => line.name.length > 0)
}

module.exports = { normaliseLines }