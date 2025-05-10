# Parser & Building an Abstract Syntax Tree

### Course: Formal Languages & Finite Automata

### Author: Postoronca Dumitru

---

## Theory

A **parser**, also known as a **syntax analyzer**, is a fundamental component of a compiler or interpreter. Its primary role is to take a sequence of tokens (produced by a lexical analyzer or lexer) as input and verify that this sequence conforms to the specified syntax rules of a formal grammar for a given programming language or data format. If the sequence of tokens is syntactically valid, the parser typically constructs a data structure representing the input's hierarchical structure, most commonly an **Abstract Syntax Tree (AST)** or a **Parse Tree**.

### Purpose of Parsing

The main purposes of parsing are:

- **Syntax Validation:** To check if the sequence of tokens forms a syntactically correct program (or structure) according to the language's grammar. If not, it reports syntax errors.
- **Structure Imposition:** To determine the grammatical structure of the input and represent it in a way that's usable by subsequent phases of compilation or interpretation (like semantic analysis or code generation).
- **Guiding Semantic Analysis:** The hierarchical structure (e.g., AST) produced by the parser is crucial for understanding the meaning (semantics) of the program.

### Input and Output

- **Input:** A linear sequence of tokens. Each token typically has a type (e.g., `IDENTIFIER`, `KEYWORD`, `NUMBER`, `OPERATOR`) and a value (e.g., `myVar`, `if`, `123`, `+`).
  _Example Token Stream (simplified):_ `[KEYWORD:if, LPAREN:(, IDENTIFIER:x, OP:>, NUMBER:10, RPAREN:), LBRACE:{, ...]`

- **Output:**

  1.  A **Parse Tree** (also called a Concrete Syntax Tree or CST), which is a direct representation of how the input string is derived from the grammar. It often contains redundant information from a semantic point of view (like parentheses or intermediate grammar rules).
  2.  An **Abstract Syntax Tree (AST)**, which is a more condensed and abstract representation of the syntactic structure. It captures the essential structural information while omitting syntactic sugar or details not relevant for semantic interpretation. ASTs are generally preferred for further processing.
  3.  **Syntax Error Messages:** If the input tokens cannot be structured according to the grammar, the parser reports errors, ideally with helpful information about the location and nature of the error.

### Relationship with the Lexer

Parsing is typically the second phase in a compiler, following lexical analysis:

1.  **Source Code (String of characters)**
    `->` **Lexical Analyzer (Lexer/Scanner)**
    `->` **Sequence of Tokens**
    `->` **Parser (Syntax Analyzer)**
    `->` **Abstract Syntax Tree (AST) / Parse Tree**
    `->` **Semantic Analyzer**
    `->` ... (Further compilation phases)

The lexer breaks the input text into meaningful tokens, simplifying the parser's job, which can then focus on the syntactic relationships between these tokens rather than individual characters.

## 5. Types of Parsers

Parsers are generally categorized into two main types based on how they construct the parse tree:

### a. Top-Down Parsers

Top-down parsers build the parse tree from the root (the start symbol of the grammar) downwards towards the leaves (the tokens). They attempt to derive the input token stream by starting with the grammar's start symbol and applying production rules.

- **Recursive Descent Parser:** A common type of top-down parser that uses a set of mutually recursive procedures, typically one for each non-terminal symbol in the grammar.
  - **Predictive Parser:** A special kind of recursive descent parser that doesn't require backtracking. It "predicts" which production rule to apply based on the next input token(s).
    - **LL Parsers:** A formal class of predictive parsers. `LL(k)` means it scans the input from **L**eft to right, constructs a **L**eftmost derivation, and uses `k` tokens of lookahead to make parsing decisions. `LL(1)` parsers are common.
- **Challenges for Top-Down Parsers:**

  - **Left Recursion:** Grammars with left-recursive rules (e.g., `E -> E + T`) can cause simple recursive descent parsers to loop infinitely. These grammars need to be transformed (e.g., by left-recursion elimination).
  - **Common Prefixes:** When multiple production rules for a non-terminal start with the same sequence of symbols, it makes prediction difficult. This requires left-factoring the grammar.

### b. Bottom-Up Parsers

Bottom-up parsers build the parse tree from the leaves (the tokens) upwards towards the root (the start symbol). They attempt to "reduce" the input token stream back to the grammar's start symbol by applying production rules in reverse.

- **Shift-Reduce Parsers:** The general mechanism for bottom-up parsing. The parser repeatedly performs two main actions:

  - **Shift:** Move the next input token onto a stack.
  - **Reduce:** If the top symbols on the stack match the right-hand side of a grammar rule, replace them with the non-terminal on the left-hand side of that rule.

- **LR Parsers:** A formal class of shift-reduce parsers. `LR(k)` means it scans the input from **L**eft to right, constructs a **R**ightmost derivation in reverse, and uses `k` tokens of lookahead. LR parsers are more powerful than LL parsers and can handle a wider range of grammars.

  - **SLR (Simple LR):** The simplest type of LR parser, but may have conflicts on some grammars.
  - **LALR (Look-Ahead LR):** A compromise between the power of canonical LR parsers and the size of SLR parsing tables. Commonly used by parser generators like YACC and Bison.
  - **CLR (Canonical LR):** The most powerful LR parser, but generates very large parsing tables, making it often impractical.

- **Advantages of Bottom-Up Parsers:**

  - Can handle a larger class of grammars than LL parsers, including left-recursive grammars.
  - Often more efficient for a given grammar.

## Objectives:

1. Get familiar with parsing, what it is and how it can be programmed [1].
2. Get familiar with the concept of AST [2].
3. In addition to what has been done in the 3rd lab work do the following:

   1. In case you didn't have a type that denotes the possible types of tokens you need to:

      1. Have a type **_TokenType_** (like an enum) that can be used in the lexical analysis to categorize the tokens.
      2. Please use regular expressions to identify the type of the token.

   2. Implement the necessary data structures for an AST that could be used for the text you have processed in the 3rd lab work.
   3. Implement a simple parser program that could extract the syntactic information from the input text.

## Topic of the language

Topic that I chose is a music definition language. In this language you can call the functions to play the certain sounds, to define loops, play multiple notes in sync.

## Implementation Description

Okay, here's a description of the parser's implementation, including code snippets from the previously discussed parser for your music definition language.

### Parser Implementation Description

This section describes the implementation of a recursive descent parser for the Music Definition Language. The parser takes a sequence of tokens generated by a lexical analyzer (lexer) and produces an Abstract Syntax Tree (AST) that represents the syntactic structure of the input code.

#### 1. Core Parser Structure and Initialization

The parser is encapsulated within a `Parser` class. It maintains a list of `tokens` to process and a `current` pointer to the token currently being examined.

Upon instantiation, the constructor filters out `NEWLINE_TOKEN`s, as these are typically insignificant for syntactic structure in this language, simplifying the parsing logic.

```typescript
// parser.ts
import {
  Token,
  TokenType,
  ASTNode,
  ProgramNode,
  StatementNode,
  AssignmentNode,
  FunctionCallNode,
  SyncBlockNode,
  ForLoopNode,
  ExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  NoteLiteralNode,
  HandLiteralNode,
  UnitNode,
  FractionLiteralNode,
  BinaryExpressionNode,
  UpdateExpressionNode,
} from "./ast-nodes";

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    // Filter out newline tokens as they generally don't affect AST structure
    this.tokens = tokens.filter((token) => token.type !== TokenType.NEWLINE);
  }

  // ... other methods ...
}
```

### 2. Main Parsing Loop

The public `parse()` method is the entry point. It iteratively calls `parseStatement()` to process each top-level statement in the input token stream. Each successfully parsed statement node is added to the `body` of a `ProgramNode`, which is the root of the AST.

```typescript
  public parse(): ProgramNode {
    const body: StatementNode[] = [];
    while (!this.isAtEnd()) {
      try {
        body.push(this.parseStatement());
      } catch (e) {
        // Simple error reporting: log and stop
        console.error("Parsing error:", e);
        throw e; // Re-throw to halt on first error
      }
    }
    return { type: 'Program', body };
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
```

### 3. Token Handling Utilities

Several private helper methods facilitate token manipulation and consumption:

- `peek()`: Returns the current token without consuming it.
- `advance()`: Consumes the current token and moves the `current` pointer to the next token. It returns the token that was just consumed.
- `consume(type, message, content?)`: Checks if the current token matches an expected `type` (and optionally `content`). If it matches, the token is consumed. Otherwise, it throws a syntax error with the provided `message`.
- `check(type, content?)`: Similar to `consume` but only checks the current token without consuming it. Returns `true` if it matches, `false` otherwise.
- `match(...typesWithContent)`: Tries to match the current token against a list of possible types (and optional contents). If a match is found, it consumes the token and returns it; otherwise, it returns `null`.

```typescript
  private peek(): Token {
    if (this.isAtEnd()) throw new Error("Unexpected end of input while peeking.");
    return this.tokens[this.current];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1]; // Returns the consumed token
  }

  private consume(type: TokenType, message: string, content?: string): Token {
    const token = this.peek();
    if (token.type === type && (content === undefined || token.content === content)) {
      return this.advance();
    }
    const foundToken = this.isAtEnd() ? "EOF" : `${this.peek().type} ('${this.peek().content}')`;
    throw new Error(`${message} Expected ${type}${content ? "('"+content+"')" : ""}, but found ${foundToken} at position ${this.current}.`);
  }

  // check() and match() methods would also be here.
  private check(type: TokenType, content?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    return token.type === type && (content === undefined || token.content === content);
  }
```

### 4. Statement Parsing

Parsing is driven by identifying and processing different kinds of statements.

#### a. `parseStatement()` Dispatcher

The `parseStatement()` method acts as a dispatcher. It examines the current token (usually a keyword) to determine which specific parsing method to call for that statement type (e.g., `parseForLoop()`, `parseAssignment()`).

```typescript
  private parseStatement(): StatementNode {
    const currentToken = this.peek();

    if (currentToken.type === TokenType.KEYWORD) {
      switch (currentToken.content) {
        case "for":
          return this.parseForLoop();
        case "sync":
          return this.parseSyncBlock();
        case "Piano":
        case "Guitar":
        case "Pause":
          return this.parseFunctionCall();
        case "Volume":
        case "Tempo":
        case "TimeSignature":
        case "note": // 'note' can start an assignment like 'note = do'
          // Check if next token is '=' for assignment
          if (this.tokens[this.current + 1]?.type === TokenType.SYMBOL &&
              this.tokens[this.current + 1]?.content === "=") {
            return this.parseAssignment();
          }
          // If 'note' is not followed by '=', it might be an error or other construct
          break;
      }
    }
    throw new Error(`Unexpected token at start of statement: ${currentToken.type} ('${currentToken.content}') at pos ${this.current}`);
  }
```

#### b. Example: `parseAssignment()`

This method handles variable assignments like `Volume = 13 dB` or `note = re`. It consumes the identifier (keyword), the assignment operator (`=`), parses the value expression, and optionally checks for a unit token if the value is a number.

```typescript
  private parseAssignment(): AssignmentNode {
    const identifierToken = this.consume(TokenType.KEYWORD, "Expected identifier (keyword) for assignment.");
    const identifier: IdentifierNode = { type: 'Identifier', name: identifierToken.content };

    this.consume(TokenType.SYMBOL, "Expected '=' for assignment.", "=");

    const valueNode = this.parseExpression(); // Value can be Number, Note, Identifier, Fraction

    let unitNode: UnitNode | undefined = undefined;
    // Check for an optional unit if the assigned value is a number
    if (valueNode.type === 'NumberLiteral' && this.check(TokenType.UNIT)) {
      const unitToken = this.advance(); // Consume the unit token
      unitNode = { type: 'Unit', value: unitToken.content };
    }

    return { type: 'Assignment', identifier, value: valueNode, unit: unitNode };
  }
```

#### c. Example: `parseForLoop()`

The `parseForLoop()` method handles the `for` loop structure: `for (initialization; condition; update) { body }`. It consumes the `for` keyword and parentheses, then recursively calls other parsing methods for each part of the loop:

- **Initialization:** Typically an assignment, parsed by `parseAssignment()`.
- **Condition:** An expression, often a binary expression like `note < si`, parsed by `parseExpression()`.
- **Update:** An update expression like `note += 1`, parsed by `parseUpdateExpression()`.
- **Body:** A sequence of statements enclosed in curly braces, each parsed by `parseStatement()`.

```typescript
  private parseForLoop(): ForLoopNode {
    this.consume(TokenType.KEYWORD, "Expected 'for' keyword.", "for");
    this.consume(TokenType.SYMBOL, "Expected '(' after 'for'.", "(");

    // Parse Initialization (e.g., note = re)
    let initialization: AssignmentNode | null = null;
    if (!this.check(TokenType.SYMBOL, ";")) {
        if (this.peek().type === TokenType.KEYWORD && this.tokens[this.current + 1]?.content === '=') {
            initialization = this.parseAssignment();
        } else {
            throw new Error("Expected assignment for for-loop initialization or ';'.");
        }
    }
    this.consume(TokenType.SYMBOL, "Expected ';' after for-loop initialization.", ";");

    // Parse Condition (e.g., note < si)
    let condition: BinaryExpressionNode | null = null;
    if (!this.check(TokenType.SYMBOL, ";")) {
        const left = this.parseExpression();
        if (this.check(TokenType.SYMBOL, "<") || this.check(TokenType.SYMBOL, ">") /* add other ops */) {
            const operator = this.advance().content;
            const right = this.parseExpression();
            condition = { type: 'BinaryExpression', left, operator, right };
        } else {
             throw new Error("Expected binary expression for for-loop condition.");
        }
    }
    this.consume(TokenType.SYMBOL, "Expected ';' after for-loop condition.", ";");

    // Parse Update (e.g., note += 1)
    let update: UpdateExpressionNode | null = null;
    if (!this.check(TokenType.SYMBOL, ")")) {
        update = this.parseUpdateExpression(); // Assumes parseUpdateExpression is defined
    }
    this.consume(TokenType.SYMBOL, "Expected ')' after for-loop clauses.", ")");

    // Parse Body
    this.consume(TokenType.SYMBOL, "Expected '{' before for-loop body.", "{");
    const body: StatementNode[] = [];
    while (!this.check(TokenType.SYMBOL, "}")) {
      if (this.isAtEnd()) throw new Error("Expected '}' to close for-loop body, but reached end of tokens.");
      body.push(this.parseStatement());
    }
    this.consume(TokenType.SYMBOL, "Expected '}' after for-loop body.", "}");

    return { type: 'ForLoop', initialization, condition, update, body };
  }

  // Definition for parseUpdateExpression (called from parseForLoop)
  private parseUpdateExpression(): UpdateExpressionNode {
    const argumentToken = this.peek();
    if (argumentToken.type !== TokenType.KEYWORD) {
        throw new Error(`Expected identifier (like 'note') for update expression, got ${argumentToken.type}`);
    }
    this.advance(); // consume identifier
    const argument: IdentifierNode = { type: 'Identifier', name: argumentToken.content };

    const operatorToken = this.peek();
    if (operatorToken.type !== TokenType.SYMBOL || operatorToken.content !== "+=") { // Example: only +=
        throw new Error(`Expected update operator like '+=', got ${operatorToken.type} ('${operatorToken.content}')`);
    }
    this.advance(); // consume operator

    const value = this.parseExpression();
    return { type: 'UpdateExpression', operator: operatorToken.content, argument, value };
  }
```

### 5. Expression Parsing

Expressions are parsed by `parseExpression()`, which often delegates to `parsePrimaryExpression()` for atomic units of an expression.

`parsePrimaryExpression()` handles:

- **Literals:** Numbers (`NumberLiteralNode`), Notes (`NoteLiteralNode`), Hands (`HandLiteralNode`).
- **Fractions:** Recognizes the `NUMBER / NUMBER` pattern to create `FractionLiteralNode`.
- **Identifiers:** Such as the `note` keyword when used as a variable in an expression context (`IdentifierNode`).

```typescript
  private parseExpression(): ExpressionNode {
    // For this language, primary expressions are handled.
    // More complex expressions with operator precedence would require a more sophisticated approach here (e.g., Pratt parser).
    return this.parsePrimaryExpression();
  }

  private parsePrimaryExpression(): ExpressionNode {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.advance(); // Consume the number token first
      // Check for fraction: NUMBER / NUMBER (e.g., 1/4)
      if (this.check(TokenType.SYMBOL, "/") &&
          this.tokens[this.current + 1]?.type === TokenType.NUMBER) { // Look ahead for / and another number
        const numerator = parseFloat(this.previous().content); // The number just consumed
        this.consume(TokenType.SYMBOL, "Expected '/' for fraction.", "/");
        const denominatorToken = this.consume(TokenType.NUMBER, "Expected number for fraction denominator.");
        return {
          type: 'FractionLiteral',
          numerator: numerator,
          denominator: parseFloat(denominatorToken.content)
        };
      }
      // Not a fraction, just a simple number
      return { type: 'NumberLiteral', value: parseFloat(this.previous().content) };
    }

    if (token.type === TokenType.NOTE) {
      this.advance();
      return { type: 'NoteLiteral', value: token.content };
    }

    if (token.type === TokenType.HAND) {
      this.advance();
      return { type: 'HandLiteral', value: token.content };
    }

    // Handle 'note' keyword when used as a variable/identifier in an expression
    if (token.type === TokenType.KEYWORD && token.content === "note") {
      this.advance();
      return { type: 'Identifier', name: token.content };
    }

    throw new Error(`Unexpected token for expression: ${token.type} ('${token.content}') at pos ${this.current}.`);
  }
```

### 6. Error Handling

The current error handling strategy is simple:

- The `consume()` method is the primary point where syntax errors are detected if an expected token is not found.
- When an error is encountered, an `Error` object is thrown, typically halting the parsing process.
- The `parse()` method includes a `try...catch` block to catch these errors and log them before re-throwing.
  More sophisticated error recovery (e.g., attempting to skip tokens and continue parsing to find multiple errors) is not implemented in this version but is a common feature in production-grade parsers.

### 7. Recursive Nature

This parser employs a **recursive descent** strategy. Parsing methods for complex structures (like `parseForLoop` or `parseStatement`) often call other parsing methods for their constituent parts (e.g., `parseExpression`, `parseAssignment`). This recursive structure naturally mirrors the hierarchical and recursive definitions found in the language's grammar. For example, a statement can contain expressions, and a `sync` block or `for` loop body can contain other statements.

### 8. Examples

Here are some examples of the input code and the generates AST

#### Example 1

```js
Volume = 13 dB
sync{
  Piano(R, do)
  Guitar(G)
}
```

```json
{
  "type": "Program",
  "body": [
    {
      "type": "Assignment",
      "identifier": {
        "type": "Identifier",
        "name": "Volume"
      },
      "value": {
        "type": "NumberLiteral",
        "value": 13
      },
      "unit": {
        "type": "Unit",
        "value": "dB"
      }
    },
    {
      "type": "SyncBlock",
      "body": [
        {
          "type": "FunctionCall",
          "functionName": {
            "type": "Identifier",
            "name": "Piano"
          },
          "arguments": [
            {
              "type": "HandLiteral",
              "value": "R"
            },
            {
              "type": "NoteLiteral",
              "value": "do"
            }
          ]
        },
        {
          "type": "FunctionCall",
          "functionName": {
            "type": "Identifier",
            "name": "Guitar"
          },
          "arguments": [
            {
              "type": "NoteLiteral",
              "value": "G"
            }
          ]
        }
      ]
    },
    {
      "type": "ForLoop",
      "initialization": {
        "type": "Assignment",
        "identifier": {
          "type": "Identifier",
          "name": "note"
        },
        "value": {
          "type": "NoteLiteral",
          "value": "re"
        }
      },
      "condition": {
        "type": "BinaryExpression",
        "left": {
          "type": "Identifier",
          "name": "note"
        },
        "operator": "<",
        "right": {
          "type": "NoteLiteral",
          "value": "si"
        }
      },
      "update": {
        "type": "UpdateExpression",
        "operator": "+=",
        "argument": {
          "type": "Identifier",
          "name": "note"
        },
        "value": {
          "type": "NumberLiteral",
          "value": 1
        }
      },
      "body": [
        {
          "type": "FunctionCall",
          "functionName": {
            "type": "Identifier",
            "name": "Piano"
          },
          "arguments": [
            {
              "type": "HandLiteral",
              "value": "R"
            },
            {
              "type": "Identifier",
              "name": "note"
            },
            {
              "type": "FractionLiteral",
              "numerator": 1,
              "denominator": 4
            }
          ]
        }
      ]
    }
  ]
}
```

#### Example 2

```js
for (note = re; note < si; note += 1) {
  Piano(R, note, 1 / 4);
}
```

```json
{
  "type": "Program",
  "body": [
    {
      "type": "ForLoop",
      "initialization": {
        "type": "Assignment",
        "identifier": {
          "type": "Identifier",
          "name": "note"
        },
        "value": {
          "type": "NoteLiteral",
          "value": "re"
        }
      },
      "condition": {
        "type": "BinaryExpression",
        "left": {
          "type": "Identifier",
          "name": "note"
        },
        "operator": "<",
        "right": {
          "type": "NoteLiteral",
          "value": "si"
        }
      },
      "update": {
        "type": "UpdateExpression",
        "operator": "+=",
        "argument": {
          "type": "Identifier",
          "name": "note"
        },
        "value": {
          "type": "NumberLiteral",
          "value": 1
        }
      },
      "body": [
        {
          "type": "FunctionCall",
          "functionName": {
            "type": "Identifier",
            "name": "Piano"
          },
          "arguments": [
            {
              "type": "HandLiteral",
              "value": "R"
            },
            {
              "type": "Identifier",
              "name": "note"
            },
            {
              "type": "FractionLiteral",
              "numerator": 1,
              "denominator": 4
            }
          ]
        }
      ]
    }
  ]
}
```

## Conclusions

Through this work, a lexical analyzer (lexer) was developed to tokenize the source code of the Music Definition Language, breaking it down into a sequence of meaningful tokens such as keywords, identifiers, notes, numbers, and symbols. Following this, a recursive descent parser was implemented. This parser processes the token stream generated by the lexer to validate the syntactic correctness of the input against the defined grammar of the language. The primary output of the parser is an Abstract Syntax Tree (AST), which hierarchically represents the structure of the parsed music program.

The implementation successfully handles key constructs of the designed language, including:

Variable assignments (e.g., Volume = 13 dB)
Function calls for musical events (e.g., Piano(R, do, 1/4))
Synchronization blocks for concurrent notes (sync {})
Iterative constructs (for loops) for repetitive musical patterns.
This practical exercise solidified the theoretical understanding of formal languages and finite automata, particularly the roles of lexers and parsers in the compilation pipeline. Key concepts such as tokenization, grammar definition (implicitly through parser logic), recursive descent parsing strategy, and AST construction were explored and applied. The process also highlighted the importance of careful token management and error detection within the parser, ensuring that syntactically incorrect programs are appropriately flagged.

Significance and Future Directions:

The developed lexer and parser form the foundational front-end for a potential interpreter or compiler for the Music Definition Language. The generated AST provides a crucial intermediate representation that can be utilized by subsequent phases, such as semantic analysis (e.g., checking for valid note ranges or instrument parameters) and code generation (e.g., translating the AST into MIDI data, audio synthesis commands, or a musical score).

Potential future enhancements for this project could include:

Implementing a semantic analyzer to perform deeper checks on the AST.
Developing an interpreter or code generator to execute the "music code" and produce audible output.
Expanding the language with more sophisticated musical features (e.g., chords, rests, dynamic changes, user-defined musical functions).
Improving error recovery mechanisms in the parser to provide more comprehensive feedback on syntax errors.
In conclusion, this laboratory work provided valuable hands-on experience in designing and building essential components of a language processing system, offering a solid foundation for further exploration in compiler design and domain-specific language development.

## References:

[1] [Parsing Wiki](https://en.wikipedia.org/wiki/Parsing)
[2] [Abstract Syntax Tree Wiki](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
