export enum TokenType {
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

export interface Token {
  type: TokenType;
  content: string;
}

// Base AST Node
export interface ASTNode {
  type: string;
}

// Program Node: Root of the AST
export interface ProgramNode extends ASTNode {
  type: "Program";
  body: StatementNode[];
}
export type StatementNode =
  | AssignmentNode
  | FunctionCallNode
  | SyncBlockNode
  | ForLoopNode;

export interface AssignmentNode extends ASTNode {
  type: "Assignment";
  identifier: IdentifierNode; // e.g., Volume, note
  value: ExpressionNode;
  unit?: UnitNode; // e.g., dB (optional)
}

export interface FunctionCallNode extends ASTNode {
  type: "FunctionCall";
  functionName: IdentifierNode; // e.g., Piano, Guitar, Pause
  arguments: ExpressionNode[];
}

export interface SyncBlockNode extends ASTNode {
  type: "SyncBlock";
  body: StatementNode[]; // Array of statements to be executed in sync
}

export interface ForLoopNode extends ASTNode {
  type: "ForLoop";
  initialization: AssignmentNode | null; // e.g., note = re
  condition: BinaryExpressionNode | null; // e.g., note < si
  update: UpdateExpressionNode | null; // e.g., note += 1
  body: StatementNode[]; // Statements inside the loop
}

// Expression Nodes
export type ExpressionNode =
  | IdentifierNode
  | NumberLiteralNode
  | NoteLiteralNode
  | HandLiteralNode
  | FractionLiteralNode
  | BinaryExpressionNode;
// UpdateExpressionNode is specific to the for-loop's update clause

export interface IdentifierNode extends ASTNode {
  type: "Identifier";
  name: string; 
}

export interface NumberLiteralNode extends ASTNode {
  type: "NumberLiteral";
  value: number;
}

export interface NoteLiteralNode extends ASTNode {
  type: "NoteLiteral";
  value: string; 
}

export interface HandLiteralNode extends ASTNode {
  type: "HandLiteral";
  value: string;
}

export interface UnitNode extends ASTNode {
  // Used with AssignmentNode
  type: "Unit";
  value: string; // e.g., "dB", "LUFS"
}

export interface FractionLiteralNode extends ASTNode {
  type: "FractionLiteral";
  numerator: number;
  denominator: number;
}

export interface BinaryExpressionNode extends ASTNode {
  type: "BinaryExpression";
  left: ExpressionNode;
  operator: string; //"<", ">", "=="
  right: ExpressionNode;
}

export interface UpdateExpressionNode extends ASTNode {
  //'note += 1'
  type: "UpdateExpression";
  operator: string; // e.g., "+="
  argument: IdentifierNode; // "note")
  value: ExpressionNode; // NumberLiteral(1))
}

export const keywords = new Set([
  "TimeSignature",
  "Tempo",
  "Volume",
  "Pause",
  "Piano",
  "Guitar",
  "for",
  "sync",
  "note",
]);
export const hands = new Set(["R", "L"]);
export const notes = new Set([
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
export const units = new Set(["LUFS", "dB"]);
export const symbols = new Set([
  "{",
  "}",
  "(",
  ")",
  "=",
  ";",
  "<",
  ">",
  "+=",
  ",",
  "/",
]);
