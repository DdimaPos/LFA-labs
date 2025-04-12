import { GrammarSymbol } from "../types";

export function arraysEqual(a: GrammarSymbol[], b: GrammarSymbol[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

