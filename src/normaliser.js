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
      let normalizedRaw = raw.replace(/\\/g, "/")

      // B. "Broken Root" Normalization (Unicode & ASCII)
      // 1. Fix Unicode: "── " -> "├── " (3 chars -> 4 chars)
      if (normalizedRaw.trim().startsWith("── ")) {
        normalizedRaw = normalizedRaw.replace("── ", "├── ")
      }
      // 2. Fix ASCII: "-- " -> "|-- " (3 chars -> 4 chars)
      // This ensures "-- folder" aligns with sibling "|-- file"
      if (normalizedRaw.trim().startsWith("-- ")) {
        normalizedRaw = normalizedRaw.replace("-- ", "|-- ")
      }

      // C. Calculate Indent
      // The regex ^[\s│├└─•*|\-+>]+ catches:
      // \s (spaces), └ (last child), + (ascii), - (dashes), | (pipes)
      const treeMatch = normalizedRaw.match(STRIP_REGEX)
      const prefixLength = treeMatch ? treeMatch[0].length : 0

      // D. Strip Explicit Comments
      const commentMarkers = [" #", " <--", " //"]
      let splitIndex = -1
      for (const marker of commentMarkers) {
        const idx = normalizedRaw.indexOf(marker)
        if (idx !== -1) {
          if (splitIndex === -1 || idx < splitIndex) splitIndex = idx
        }
      }
      let cleaned = splitIndex !== -1 ? normalizedRaw.substring(0, splitIndex) : normalizedRaw

      // E. Deep Cleaning Chain
      cleaned = cleaned
        .replace(STRIP_REGEX, "")           
        .replace(LEADING_EMOJI_REGEX, "")   
        .replace(TRAILING_EMOJI_REGEX, "")  
        .replace(PAREN_COMMENT_REGEX, "")   
        .replace(TRAILING_EMOJI_REGEX, "")  
        .replace(/\/$/, "")                 
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