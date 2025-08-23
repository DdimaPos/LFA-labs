import {
  Token,
  TokenType,
  ProgramNode,
  StatementNode,
  AssignmentNode,
  FunctionCallNode,
  SyncBlockNode,
  ForLoopNode,
  ExpressionNode,
  IdentifierNode,
  UnitNode,
  BinaryExpressionNode,
  UpdateExpressionNode,
} from "./ast-nodes.js"; // Assuming ast-nodes.ts is in the same directory

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens.filter((token) => token.type !== TokenType.NEWLINE);
  }

  public parse(): ProgramNode {
    const body: StatementNode[] = [];
    while (!this.isAtEnd()) {
      try {
        body.push(this.parseStatement());
      } catch (e) {
        console.error("Parsing error:", e);
        throw e;
      }
    }

    return { type: "Program", body };
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    if (this.isAtEnd())
      throw new Error("Unexpected end of input while peeking.");
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  // checks if the current token matches the expected type
  // by matching with previous one
  private check(type: TokenType, content?: string): boolean {
    if (this.isAtEnd()) return false;

    const token = this.peek();

    return (
      token.type === type &&
      (content === undefined || token.content === content)
    );
  }

  // Consumes the current token if it matches, otherwise throws an error
  private consume(type: TokenType, message: string, content?: string): Token {
    if (this.check(type, content)) {
      return this.advance();
    }
    const foundToken = this.isAtEnd()
      ? "EOF"
      : `${this.peek().type} ('${this.peek().content}')`;
    throw new Error(
      `${message} Expected ${type}${content ? "('" + content + "')" : ""}, but found ${foundToken} at position ${this.current}.`,
    );
  }

  // Tries to match one of the given token types/contents and advances if successful
  private match(
    ...typesWithContent: Array<[TokenType, string?] | TokenType>
  ): Token | null {
    for (const typeOrPair of typesWithContent) {
      if (Array.isArray(typeOrPair)) {
        const [type, content] = typeOrPair;
        if (this.check(type, content)) {
          return this.advance();
        }
      } else {
        if (this.check(typeOrPair)) {
          return this.advance();
        }
      }
    }
    return null;
  }

  // --- Statement Parsers ---
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
        case "note":
          if (
            this.tokens[this.current + 1]?.type === TokenType.SYMBOL &&
            this.tokens[this.current + 1]?.content === "="
          ) {
            return this.parseAssignment();
          }
          break;
      }
    }
    throw new Error(
      `Unexpected token at start of statement: ${currentToken.type} ('${currentToken.content}')`,
    );
  }

  private parseAssignment(): AssignmentNode {
    const identifierToken = this.consume(
      TokenType.KEYWORD,
      "Expected identifier (keyword) for assignment.",
    );
    const identifier: IdentifierNode = {
      type: "Identifier",
      name: identifierToken.content,
    };

    this.consume(TokenType.SYMBOL, "Expected '=' for assignment.", "=");

    const valueNode = this.parseExpression();

    let unitNode: UnitNode | undefined = undefined;
    if (valueNode.type === "NumberLiteral" && this.check(TokenType.UNIT)) {
      const unitToken = this.advance();
      unitNode = { type: "Unit", value: unitToken.content };
    }

    return { type: "Assignment", identifier, value: valueNode, unit: unitNode };
  }

  private parseFunctionCall(): FunctionCallNode {
    const functionNameToken = this.consume(
      TokenType.KEYWORD,
      "Expected function name (keyword).",
    );
    const functionName: IdentifierNode = {
      type: "Identifier",
      name: functionNameToken.content,
    };

    this.consume(TokenType.SYMBOL, "Expected '(' after function name.", "(");

    const args: ExpressionNode[] = [];
    if (!this.check(TokenType.SYMBOL, ")")) {
      do {
        args.push(this.parseExpression());
      } while (this.match([TokenType.SYMBOL, ","]));
    }

    this.consume(
      TokenType.SYMBOL,
      "Expected ')' after function arguments.",
      ")",
    );
    return { type: "FunctionCall", functionName, arguments: args };
  }

  private parseForLoop(): ForLoopNode {
    this.consume(TokenType.KEYWORD, "Expected 'for' keyword.", "for");
    this.consume(TokenType.SYMBOL, "Expected '(' after 'for'.", "(");

    let initialization: AssignmentNode | null = null;
    if (!this.check(TokenType.SYMBOL, ";")) {
      // If not immediately a semicolon, expect an assignment
      // Expect 'note = value' or similar
      if (
        this.peek().type === TokenType.KEYWORD &&
        this.tokens[this.current + 1]?.content === "="
      ) {
        initialization = this.parseAssignment();
      } else {
        throw new Error(
          "Expected assignment for for-loop initialization or ';'.",
        );
      }
    }
    this.consume(
      TokenType.SYMBOL,
      "Expected ';' after for-loop initialization.",
      ";",
    );

    let condition: BinaryExpressionNode | null = null;
    if (!this.check(TokenType.SYMBOL, ";")) {
      // If not immediately a semicolon, expect a condition
      const left = this.parseExpression(); // e.g., 'note' (Identifier)
      if (
        this.check(TokenType.SYMBOL, "<") ||
        this.check(TokenType.SYMBOL, ">") ||
        this.check(TokenType.SYMBOL, "==") /* add other comparison ops */
      ) {
        const operator = this.advance().content;
        const right = this.parseExpression(); // e.g., 'si' (NoteLiteral) or a number
        condition = { type: "BinaryExpression", left, operator, right };
      } else {
        throw new Error(
          "Expected binary expression (e.g. note < si) for for-loop condition.",
        );
      }
    }
    this.consume(
      TokenType.SYMBOL,
      "Expected ';' after for-loop condition.",
      ";",
    );

    let update: UpdateExpressionNode | null = null;
    if (!this.check(TokenType.SYMBOL, ")")) {
      // If not immediately ')', expect an update expression
      const argumentToken = this.peek();
      if (argumentToken.type !== TokenType.KEYWORD) {
        // Expecting 'note' or similar identifier
        throw new Error(
          `Expected identifier (like 'note') for update expression, got ${argumentToken.type}`,
        );
      }
      this.advance(); // consume identifier
      const argument: IdentifierNode = {
        type: "Identifier",
        name: argumentToken.content,
      };

      const operatorToken = this.peek();
      if (
        operatorToken.type !== TokenType.SYMBOL ||
        operatorToken.content !== "+="
      ) {
        // Only handling += for now as per example
        throw new Error(
          `Expected update operator like '+=', got ${operatorToken.type} ('${operatorToken.content}')`,
        );
      }
      this.advance(); // consume operator

      const value = this.parseExpression(); // e.g., a number like '1'
      update = {
        type: "UpdateExpression",
        operator: operatorToken.content,
        argument,
        value,
      };
    }
    this.consume(TokenType.SYMBOL, "Expected ')' after for-loop clauses.", ")");

    this.consume(TokenType.SYMBOL, "Expected '{' before for-loop body.", "{");
    const body: StatementNode[] = [];
    while (!this.check(TokenType.SYMBOL, "}")) {
      if (this.isAtEnd())
        throw new Error(
          "Expected '}' to close for-loop body, but reached end of tokens.",
        );
      body.push(this.parseStatement());
    }
    this.consume(TokenType.SYMBOL, "Expected '}' after for-loop body.", "}");

    return { type: "ForLoop", initialization, condition, update, body };
  }

  private parseSyncBlock(): SyncBlockNode {
    this.consume(TokenType.KEYWORD, "Expected 'sync' keyword.", "sync");
    this.consume(TokenType.SYMBOL, "Expected '{' before sync block body.", "{");

    const body: StatementNode[] = [];
    while (!this.check(TokenType.SYMBOL, "}")) {
      if (this.isAtEnd())
        throw new Error(
          "Expected '}' to close sync block body, but reached end of tokens.",
        );
      body.push(this.parseStatement());
    }
    this.consume(TokenType.SYMBOL, "Expected '}' after sync block body.", "}");
    return { type: "SyncBlock", body };
  }

  // --- Expression Parsers ---

  private parseExpression(): ExpressionNode {
    return this.parsePrimaryExpression();
  }

  private parsePrimaryExpression(): ExpressionNode {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.advance(); // consume the number token
      // Check for fraction: NUMBER / NUMBER
      if (
        this.check(TokenType.SYMBOL, "/") &&
        this.tokens[this.current + 1]?.type === TokenType.NUMBER
      ) {
        const numerator = parseFloat(this.previous().content); // The number we just consumed
        this.consume(TokenType.SYMBOL, "Expected '/' for fraction.", "/");
        const denominatorToken = this.consume(
          TokenType.NUMBER,
          "Expected number for fraction denominator.",
        );
        return {
          type: "FractionLiteral",
          numerator: numerator,
          denominator: parseFloat(denominatorToken.content),
        };
      }
      // Not a fraction, just a number
      return {
        type: "NumberLiteral",
        value: parseFloat(this.previous().content),
      };
    }

    if (token.type === TokenType.NOTE) {
      this.advance();
      return { type: "NoteLiteral", value: token.content };
    }

    if (token.type === TokenType.HAND) {
      this.advance();
      return { type: "HandLiteral", value: token.content };
    }

    if (token.type === TokenType.KEYWORD && token.content === "note") {
      this.advance();
      return { type: "Identifier", name: token.content };
    }

    throw new Error(
      `Unexpected token for expression: ${token.type} ('${token.content}') at pos ${this.current}.`,
    );
  }
}

// // Example 1
// const exampleTokens: Token[] = [
//     { type: TokenType.KEYWORD, content: "Volume" },
//     { type: TokenType.SYMBOL, content: "=" },
//     { type: TokenType.NUMBER, content: "13" },
//     { type: TokenType.UNIT, content: "dB" },
//     { type: TokenType.NEWLINE, content: "" }, // Lexer might produce these
//     { type: TokenType.KEYWORD, content: "sync" },
//     { type: TokenType.SYMBOL, content: "{" },
//     { type: TokenType.NEWLINE, content: "" },
//     { type: TokenType.KEYWORD, content: "Piano" },
//     { type: TokenType.SYMBOL, content: "(" },
//     { type: TokenType.HAND, content: "R" },
//     { type: TokenType.SYMBOL, content: "," },
//     { type: TokenType.NOTE, content: "do" },
//     { type: TokenType.SYMBOL, content: ")" },
//     { type: TokenType.NEWLINE, content: "" },
//     { type: TokenType.SYMBOL, content: "}" },
// ];
//
// const parser = new Parser(exampleTokens);
// try {
//     const ast = parser.parse();
//     console.log(JSON.stringify(ast, null, 2));
// } catch (error: any) {
//     console.error("Parser failed:", error.message);
// }

// Example 2
const forLoopTokens: Token[] = [
  { type: TokenType.KEYWORD, content: "for" },
  { type: TokenType.SYMBOL, content: "(" },
  { type: TokenType.KEYWORD, content: "note" },
  { type: TokenType.SYMBOL, content: "=" },
  { type: TokenType.NOTE, content: "re" },
  { type: TokenType.SYMBOL, content: ";" },
  { type: TokenType.KEYWORD, content: "note" },
  { type: TokenType.SYMBOL, content: "<" },
  { type: TokenType.NOTE, content: "si" },
  { type: TokenType.SYMBOL, content: ";" },
  { type: TokenType.KEYWORD, content: "note" },
  { type: TokenType.SYMBOL, content: "+=" },
  { type: TokenType.NUMBER, content: "1" },
  { type: TokenType.SYMBOL, content: ")" },
  { type: TokenType.SYMBOL, content: "{" },
  { type: TokenType.KEYWORD, content: "Piano" },
  { type: TokenType.SYMBOL, content: "(" },
  { type: TokenType.HAND, content: "R" },
  { type: TokenType.SYMBOL, content: "," },
  { type: TokenType.KEYWORD, content: "note" }, 
  { type: TokenType.SYMBOL, content: "," },
  { type: TokenType.NUMBER, content: "1" }, 
  { type: TokenType.SYMBOL, content: "/" },
  { type: TokenType.NUMBER, content: "4" }, 
  { type: TokenType.SYMBOL, content: ")" },
  { type: TokenType.SYMBOL, content: "}" },
];
const parser2 = new Parser(forLoopTokens);
try {
  const ast2 = parser2.parse();
  console.log(JSON.stringify(ast2, null, 2));
} catch (error: any) {
  console.error("Parser failed for loop:", error.message);
}


// Example 3
// const tokens: Token[] = [
//   {
//     type: TokenType.KEYWORD,
//     content: "Volume",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "=",
//   },
//   {
//     type: TokenType.NUMBER,
//     content: "13",
//   },
//   {
//     type: TokenType.UNIT,
//     content: "dB",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "sync",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "{",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "Piano",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "(",
//   },
//   {
//     type: TokenType.HAND,
//     content: "R",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ",",
//   },
//   {
//     type: TokenType.NOTE,
//     content: "do",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ")",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "Guitar",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "(",
//   },
//   {
//     type: TokenType.NOTE,
//     content: "G",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ")",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "}",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "for",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "(",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "note",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "=",
//   },
//   {
//     type: TokenType.NOTE,
//     content: "re",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ";",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "note",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "<",
//   },
//   {
//     type: TokenType.NOTE,
//     content: "si",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ";",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "note",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "+=",
//   },
//   {
//     type: TokenType.NUMBER,
//     content: "1",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ")",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "{",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "Piano",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "(",
//   },
//   {
//     type: TokenType.HAND,
//     content: "R",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ",",
//   },
//   {
//     type: TokenType.KEYWORD,
//     content: "note",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ",",
//   },
//   {
//     type: TokenType.NUMBER,
//     content: "1",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "/",
//   },
//   {
//     type: TokenType.NUMBER,
//     content: "4",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: ")",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.SYMBOL,
//     content: "}",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
//   {
//     type: TokenType.NEWLINE,
//     content: "",
//   },
// ];
//
// const parser3 = new Parser(tokens);
// try {
//   const ast2 = parser3.parse();
//   console.log(JSON.stringify(ast2, null, 2));
// } catch (error: any) {
//   console.error("Parser failed for loop:", error.message);
// }
