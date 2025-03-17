import * as fs from "fs";

enum TokenType {
  SYMBOL = "SYMBOL_TOKEN",
  FRACTION = "FRACTION_TOKEN",
  NUMBER = "NUMBER_TOKEN",
  UNIT = "UNIT_TOKEN",
  KEYWORD = "KEYWORD_TOKEN",
  HAND = "HAND_TOKEN",
  NOTE = "NOTE_TOKEN",
  ERROR = "ERROR_TOKEN",
  NEWLINE = "NEWLINE_TOKEN",
}

interface Token {
  type: TokenType;
  content: string;
}

const keywords = new Set([
  "TimeSignature",
  "Tempo",
  "Volume",
  "Pause",
  "Piano",
  "Guitar",
  "for",
  "sync",
  "note"
]);
const hands = new Set(["R", "L"]);
const notes = new Set([
  "do",
  "re",
  "mi",
  "fa",
  "sol",
  "la",
  "si",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
]);
const units = new Set(["LUFS", "dB"]);
const symbols = new Set(["{", "}", "(", ")", "=", ";", "<", "+=", ",", "/"]);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const lines = input.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line !== "") {
      const words = line.match(/(\+=|[-+*/<>=!]=?|[\w]+|[{}();,])/g) || [];

      for (const word of words) {
        if (keywords.has(word)) {
          tokens.push({ type: TokenType.KEYWORD, content: word });
        } else if (hands.has(word)) {
          tokens.push({ type: TokenType.HAND, content: word });
        } else if (notes.has(word)) {
          tokens.push({ type: TokenType.NOTE, content: word });
        } else if (units.has(word)) {
          tokens.push({ type: TokenType.UNIT, content: word });
        } else if (symbols.has(word)) {
          tokens.push({ type: TokenType.SYMBOL, content: word });
        } else if (/^\d+(\.\d+)?$/.test(word)) {
          tokens.push({ type: TokenType.NUMBER, content: word });
        } else {
          tokens.push({ type: TokenType.ERROR, content: word });
          throw new Error(`Uknown token at line ${i+1}: ${word}`)
        }
      }
    }

    tokens.push({ type: TokenType.NEWLINE, content: "" });
  }

  return tokens;
}

function processFile(inputPath: string, outputPath: string) {
  const input = fs.readFileSync(inputPath, "utf-8");
  const tokens = tokenize(input);
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
}

const inputFile = `input.dsl`; 
const outputFile = `tokens.json`;
processFile(inputFile, outputFile);

console.log(`Tokenized output saved to ${outputFile}`);
