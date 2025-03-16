# Lexer & Scanner

### Course: Formal Languages & Finite Automata

### Author: Postoronca Dumitru

---

## Theory

A **Lexer**, also known as a lexical analyzer, is a fundamental component of a compiler or interpreter that processes input text and converts it into a sequence of tokens. A token is a structured representation of meaningful elements in a programming language, such as keywords, identifiers, literals, operators, and punctuation. The lexer plays a crucial role in breaking down the raw input into a form that is easier for subsequent stages, like parsing, to process.

- A lexer operates using a set of predefined rules, often specified using regular expressions or finite automata, to recognize and classify different tokens. It scans the input sequentially, grouping characters into meaningful units.
- The concept of lexical analysis can be related to finite automata, as a lexer can be implemented using **Deterministic Finite Automata (DFA)** or **Nondeterministic Finite Automata (NFA)** to efficiently recognize token patterns.

A **Deterministic Lexer** follows a strict rule where, given a current state and an input character, there is only one possible next state. This approach ensures predictability and efficiency. On the other hand, a **Nondeterministic Lexer** may have multiple possible transitions for a given input, requiring additional steps to resolve ambiguity, such as backtracking or lookahead techniques.

Lexers can be categorized based on their complexity and functionality:

- **Simple Lexers** work with a basic set of rules and operate in a single pass, making them efficient for straightforward tokenization tasks.
- **Complex Lexers** may involve multiple passes, require symbol tables, and handle context-sensitive lexical analysis, such as resolving reserved keywords from identifiers.

Despite its role as a separate phase in many compiler architectures, lexical analysis is closely tied to syntax analysis, as the output of the lexer serves as the input for the parser. Optimizing the lexer for efficiency ensures faster and more reliable language processing.

## Objectives:

- Understand what lexical analysis [1] is.

- Get familiar with the inner workings of a lexer/scanner/tokenizer.

- Implement a sample lexer and show how it works.

Note: Just because too many students were showing me the same idea of lexer for a calculator, I've decided to specify requirements for such case. Try to make it at least a little more complex. Like, being able to pass integers and floats, also to be able to perform trigonometric operations (cos and sin). But it does not mean that you need to do the calculator, you can pick anything interesting you want

## Implementation Description

Lexer implementation will give as an output a data structure which represents an array of tokens. Using JavaScript regular expressions I identified each token and saved it as an object of form

```
{"token_type":"content"}
```

### **Core Functionalities**

1. **Initialization**

   - The constructor initializes the `input` string, sets the `position` at the start, and prepares an empty `tokens` array to store the recognized tokens.

2. **Tokenization Process**

   - The `tokenize()` method iterates through the input, skipping whitespace and analyzing characters to determine token types.
   - The lexer processes identifiers and keywords, numbers, string literals, and symbols accordingly.

3. **Token Classification**

   - **Keywords**
     - Check if the current string is in the set of available keywords
   - **Notes**
     - Current string can be from the set of notes (`do-si` and `A-G`)
   - **Numbers**
     - Extracts sequences of digits and classifies them as **NUMBER_TOKEN**.
   - **Symbols and Operators**
     - Identifies **mathematical**, **comparison**, and **punctuation** symbols.
   - **Sound measurement units**
     - To define the volume of a chunck, the user can define it by indicating the `db` or `LUFS`

4. **Error Handling**
   - The lexer throws errors for unexpected characters or unterminated string literals.

### **Example Tokenization**

Given the input:

```js
Volume = 13 dB
sync{
  Piano(R, do)
  Guitar(G)
}
```

The lexer will produce:

```json
[
  {
    "type": "KEYWORD_TOKEN",
    "content": "Volume"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "="
  },
  {
    "type": "NUMBER_TOKEN",
    "content": "13"
  },
  {
    "type": "UNIT_TOKEN",
    "content": "dB"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "sync"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "{"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "Piano"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "("
  },
  {
    "type": "HAND_TOKEN",
    "content": "R"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ","
  },
  {
    "type": "NOTE_TOKEN",
    "content": "do"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ")"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "Guitar"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "("
  },
  {
    "type": "NOTE_TOKEN",
    "content": "G"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ")"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "}"
  }
]
```

For the loop structure you can see the following example:
```js
for(note = re; note < si; note += 1){
  Piano(R, note, 1/4)
}
```
This structured output enables further processing in a compiler or interpreter.

```js
[
 {
    "type": "KEYWORD_TOKEN",
    "content": "for"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "("
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "note"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "="
  },
  {
    "type": "NOTE_TOKEN",
    "content": "re"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ";"
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "note"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "<"
  },
  {
    "type": "NOTE_TOKEN",
    "content": "si"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ";"
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "note"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "+="
  },
  {
    "type": "NUMBER_TOKEN",
    "content": "1"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ")"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "{"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "Piano"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "("
  },
  {
    "type": "HAND_TOKEN",
    "content": "R"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ","
  },
  {
    "type": "KEYWORD_TOKEN",
    "content": "note"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ","
  },
  {
    "type": "NUMBER_TOKEN",
    "content": "1"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "/"
  },
  {
    "type": "NUMBER_TOKEN",
    "content": "4"
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": ")"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "SYMBOL_TOKEN",
    "content": "}"
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  },
  {
    "type": "NEWLINE_TOKEN",
    "content": ""
  }
]
```

Also you can see how the error handling works:
```js
Volume = 13 dB
hello world
sync{
  Piano(R, do)
  Guitar(G)
}
```

We get this error:
```
Error: Uknown token at line 2: hello
    at tokenize (/home/starplatinum/Documents/TUM_info/Sem_4/LFA/LFA-l
abs/Lab3/dist/index.js:111:27)
    at processFile (/home/starplatinum/Documents/TUM_info/Sem_4/LFA/LF
A-labs/Lab3/dist/index.js:121:20)
    at Object.<anonymous> (/home/starplatinum/Documents/TUM_info/Sem_4
/LFA/LFA-labs/Lab3/dist/index.js:126:1)

```
## Conclusions

The implemented **Lexer** successfully tokenizes an input string by identifying different
elements such as **keywords, identifiers, numbers, strings, operators, and punctuation**. 
It follows a structured approach to scan, classify, and generate a token list that can be used for 
further processing in a parser or interpreter. The implementation includes  is used in order to create a 
DSL for music creation where user can create his own music by code.

This approach ensures that expressions like **Synchronously played notes, looped notes, constand definitions** can be effectively parsed for analysis or execution.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Lexical_analysis)
- [A sample of lexical analyzer](https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl01.html)
