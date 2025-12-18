// src/normaliser.js

// Catch standard tree characters, markdown bullets, and ASCII symbols (+, >, -)
const STRIP_REGEX = /^[\s│├└─•*|\-+>]+/

function normaliseLines(input) {
  return input
    .split("\n")
    .map(line => line.replace(/\r/g, "")) // Handle Windows CRLF
    .filter(Boolean)
    .map(raw => {
      // 1. Windows Fix: Normalize backslashes to forward slashes immediately
      const normalizedRaw = raw.replace(/\\/g, "/")

      // 2. Calculate indent based on the full prefix (spaces + tree chars)
      const match = normalizedRaw.match(STRIP_REGEX)
      const prefixLength = match ? match[0].length : 0

      // 3. Strip comments (anything after ' #')
      const commentIndex = normalizedRaw.indexOf(" #")
      let cleaned = commentIndex !== -1 ? normalizedRaw.substring(0, commentIndex) : normalizedRaw

      // 4. Check for explicit trailing slash
      const endsWithSlash = cleaned.trim().endsWith("/")

      // 5. Clean up the name
      cleaned = cleaned
        .replace(STRIP_REGEX, "") // Remove tree characters
        .replace(/\/$/, "")       // Remove trailing slash for name storage
        .trim()

      return {
        raw: normalizedRaw,
        indent: prefixLength,
        name: cleaned,
        explicitFolder: endsWithSlash
      }
    })
    .filter(line => line.name.length > 0)
}

module.exports = { normaliseLines }