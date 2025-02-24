import { FiniteAutomaton } from "./finiteAutomaton"; 
export class Grammar {
  private VN: Set<string>;
  private VT: Set<string>;
  private P: Map<string, string[]>;
  private S: string;

  constructor(
    VN: string[],
    VT: string[],
    P: Record<string, string[]>,
    S: string,
  ) {
    this.VN = new Set(VN);
    this.VT = new Set(VT);
    this.P = new Map(Object.entries(P));
    this.S = S;
  }

  public generateString(): string {
    let result = this.expand(this.S);
    return result;
  }

  private expand(symbol: string): string {
    if (!this.VN.has(symbol)) {
      return symbol;
    }

    const productions = this.P.get(symbol); //get the prod. rules for choosen symbol
    if (!productions) {
      throw new Error(`No production rules found for ${symbol}`);
    }

    //get random prod. rule
    const chosenRule =
      productions[Math.floor(Math.random() * productions.length)];

    //expand recursively for each character in the chosen rule
    return chosenRule
      .split("")
      .map((char) => this.expand(char))
      .join("");
  }

  public toFiniteAutomaton(): FiniteAutomaton {
    const states = Array.from(this.VN);//States = Non-terminals
    const alphabet = Array.from(this.VT);//Alphabet = Terminals
    const transitions: Map<string, Map<string, string>> = new Map();
    const finalStates: Set<string> = new Set();

    //transition map
    for (const state of states) {
      transitions.set(state, new Map());
    }

    //unique final state
    const finalState = "F";
    states.push(finalState);
    transitions.set(finalState, new Map());

    //process grammar rules to create FA transitions
    for (const [left, productions] of this.P.entries()) {
      for (const production of productions) {
        if (production.length === 1) {
          //terminal-only rule (A → b)
          const terminal = production[0];
          if (this.VT.has(terminal)) {
            transitions.get(left)?.set(terminal, finalState); //move to final state
            finalStates.add(finalState);
          }
        } else if (production.length === 2) {
          //rule of form X → aY
          const terminal = production[0];
          const nextState = production[1];

          if (this.VT.has(terminal) && this.VN.has(nextState)) {
            transitions.get(left)?.set(terminal, nextState);
          }
        }
      }
    }

    return new FiniteAutomaton(
      states,
      alphabet,
      transitions,
      this.S,
      Array.from(finalStates),
    );
  }}
