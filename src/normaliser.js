// src/normaliser.js

// 1. Tree Characters & Bullets
const STRIP_REGEX = /^[\s│├└─•*|\-+>]+/

// 2. Leading Emojis (e.g. "📁 src")
const LEADING_EMOJI_REGEX = /^[\p{Emoji}\u200d\ufe0f]+\s*/u

// 3. Trailing Emojis (e.g. "index.js 🚀")
// Must have a space before it to preserve files like "logo_🔥.png"
const TRAILING_EMOJI_REGEX = /\s+[\p{Emoji}\u200d\ufe0f]+$/u

// 4. Trailing Parenthesis (e.g. "index.js (Logic)")
const PAREN_COMMENT_REGEX = /\s+\([^)]+\)$/

function normaliseLines(input) {
  return input
    .split("\n")
    .map(line => line.replace(/\r/g, ""))
    .filter(Boolean)
    .map(raw => {
      // A. Normalize slashes
      const normalizedRaw = raw.replace(/\\/g, "/")

      // B. Calculate Indent
      const treeMatch = normalizedRaw.match(STRIP_REGEX)
      const prefixLength = treeMatch ? treeMatch[0].length : 0

      // C. Strip Explicit Comments (#, //, <--)
      const commentMarkers = [" #", " <--", " //"]
      let splitIndex = -1
      for (const marker of commentMarkers) {
        const idx = normalizedRaw.indexOf(marker)
        if (idx !== -1) {
          if (splitIndex === -1 || idx < splitIndex) splitIndex = idx
        }
      }
      let cleaned = splitIndex !== -1 ? normalizedRaw.substring(0, splitIndex) : normalizedRaw

      // D. Deep Cleaning Chain
      // We repeat the trailing checks to handle mixed cases like "file.js (Logic) 🚀"
      cleaned = cleaned
        .replace(STRIP_REGEX, "")           // Remove tree chars
        .replace(LEADING_EMOJI_REGEX, "")   // Remove leading emojis
        .replace(TRAILING_EMOJI_REGEX, "")  // Remove trailing emojis (Pass 1)
        .replace(PAREN_COMMENT_REGEX, "")   // Remove trailing parens
        .replace(TRAILING_EMOJI_REGEX, "")  // Remove trailing emojis (Pass 2 - catches leftovers)
        .replace(/\/$/, "")                 // Remove trailing slash
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