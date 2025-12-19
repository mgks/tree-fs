// src/normaliser.js

// 1. Tree Characters & Bullets
const STRIP_REGEX = /^[\s│├└─•*|\-+>]+/

// 2. Emoji Regex (Matches standard unicode emojis at the start of strings)
// Uses the 'u' flag for unicode support.
const EMOJI_REGEX = /^[\p{Emoji}\u200d\ufe0f]+\s*/u

// 3. Trailing Parenthesis Comment Regex
// Matches " (Text)" at the end of the string.
// Must have at least one space before the '(' to distinguish from files like "data(1).json"
const PAREN_COMMENT_REGEX = /\s+\([^)]+\)$/

function normaliseLines(input) {
  return input
    .split("\n")
    .map(line => line.replace(/\r/g, "")) // Windows CRLF handling
    .filter(Boolean)
    .map(raw => {
      // A. Normalize slashes
      const normalizedRaw = raw.replace(/\\/g, "/")

      // B. Calculate Indent (based on tree characters)
      const treeMatch = normalizedRaw.match(STRIP_REGEX)
      const prefixLength = treeMatch ? treeMatch[0].length : 0

      // C. Strip Standard Comments (#, //, <--)
      const commentMarkers = [" #", " <--", " //"]
      let splitIndex = -1

      for (const marker of commentMarkers) {
        const idx = normalizedRaw.indexOf(marker)
        if (idx !== -1) {
          if (splitIndex === -1 || idx < splitIndex) {
            splitIndex = idx
          }
        }
      }

      let cleaned = splitIndex !== -1 ? normalizedRaw.substring(0, splitIndex) : normalizedRaw

      // D. Clean the Name
      cleaned = cleaned
        .replace(STRIP_REGEX, "")         // 1. Remove tree structure
        .replace(EMOJI_REGEX, "")         // 2. Remove emojis (📁, 📄, etc)
        .replace(PAREN_COMMENT_REGEX, "") // 3. Remove (The logic)
        .replace(/\/$/, "")               // 4. Remove trailing slash
        .trim()

      return {
        raw: normalizedRaw,
        indent: prefixLength,
        name: cleaned,
        explicitFolder: normalizedRaw.trim().endsWith("/")
      }
    })
    .filter(line => line.name.length > 0)
}

module.exports = { normaliseLines }