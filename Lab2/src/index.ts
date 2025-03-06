/**
 * Finite Automaton Implementation in TypeScript
 */

type State = string;
type InputSymbol = string;  // Renamed from "Symbol" to "InputSymbol" to avoid conflicts

/**
 * TransitionMap holds, for each state and input symbol,
 * a set of next states.
 */
interface TransitionMap {
  [state: string]: { [symbol: string]: Set<State> };
}

/**
 * FiniteAutomaton class represents an automaton (NDFA/DFA)
 * and provides methods for checking determinism, converting
 * to a DFA, and converting to a regular grammar.
 */
class FiniteAutomaton {
  states: Set<State>;
  alphabet: Set<InputSymbol>;
  initialState: State;
  finalStates: Set<State>;
  transitions: TransitionMap;

  constructor(
    states: State[],
    alphabet: InputSymbol[],
    initialState: State,
    finalStates: State[],
    transitions: { from: State; symbol: InputSymbol; to: State }[]
  ) {
    this.states = new Set(states);
    this.alphabet = new Set(alphabet);
    this.initialState = initialState;
    this.finalStates = new Set(finalStates);
    this.transitions = {};

    // Initialize transitions map for each state and symbol.
    for (let state of states) {
      this.transitions[state] = {};
      for (let sym of alphabet) {
        this.transitions[state][sym] = new Set<State>();
      }
    }

    // Populate transitions based on provided rules.
    for (let trans of transitions) {
      if (!this.transitions[trans.from]) {
        this.transitions[trans.from] = {};
      }
      if (!this.transitions[trans.from][trans.symbol]) {
        this.transitions[trans.from][trans.symbol] = new Set<State>();
      }
      this.transitions[trans.from][trans.symbol].add(trans.to);
    }
  }

  /**
   * Determines if the automaton is deterministic.
   * For each state and symbol, there must be at most one transition.
   */
  isDeterministic(): boolean {
    for (let state of this.states) {
      for (let sym of this.alphabet) {
        if (this.transitions[state][sym].size > 1) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Converts the NDFA into a DFA using the subset construction algorithm.
   * Each DFA state is represented as a comma-separated string of NDFA states.
   */
  convertToDFA(): FiniteAutomaton {
    // Hold new DFA states as string keys (each representing a subset of NDFA states).
    let dfaStates = new Set<string>();
    let dfaFinalStates = new Set<string>();
    let dfaTransitions: { from: string; symbol: InputSymbol; to: string }[] = [];

    // Queue for processing subsets
    let queue: string[] = [];

    // Helper function: convert a set of states into a sorted, comma-separated string.
    const stateSetToString = (states: Set<State>): string => {
      return Array.from(states).sort().join(',');
    };

    // Start with the NDFA initial state
    let startSet = new Set<State>();
    startSet.add(this.initialState);
    let startStateStr = stateSetToString(startSet);
    dfaStates.add(startStateStr);
    queue.push(startStateStr);

    // Process each subset in the queue.
    while (queue.length > 0) {
      let current = queue.shift()!;
      let currentSet = new Set<State>(current.split(',').filter(s => s));

      // Mark DFA state as final if any NDFA state inside is final.
      for (let state of currentSet) {
        if (this.finalStates.has(state)) {
          dfaFinalStates.add(current);
          break;
        }
      }

      // For each symbol, compute the set of NDFA states reachable.
      for (let sym of this.alphabet) {
        let nextSet = new Set<State>();
        for (let state of currentSet) {
          for (let nextState of this.transitions[state][sym]) {
            nextSet.add(nextState);
          }
        }
        if (nextSet.size === 0) {
          continue; // No transition exists for this symbol.
        }
        let nextStateStr = stateSetToString(nextSet);
        dfaTransitions.push({ from: current, symbol: sym, to: nextStateStr });
        if (!dfaStates.has(nextStateStr)) {
          dfaStates.add(nextStateStr);
          queue.push(nextStateStr);
        }
      }
    }

    // Construct and return the new DFA as a FiniteAutomaton.
    return new FiniteAutomaton(
      Array.from(dfaStates),
      Array.from(this.alphabet),
      startStateStr,
      Array.from(dfaFinalStates),
      dfaTransitions
    );
  }

  /**
   * Converts the automaton into a regular grammar.
   * For each transition A --a--> B, it creates a production A → aB.
   * Additionally, for every final state A, it adds a production A → ε.
   */
  toRegularGrammar(): RegularGrammar {
    let grammar = new RegularGrammar();
    for (let state of this.states) {
      // For final states, include the production to ε.
      if (this.finalStates.has(state)) {
        grammar.addProduction(state, 'ε');
      }
      // For every transition, add production A -> aB.
      for (let sym of this.alphabet) {
        for (let nextState of this.transitions[state][sym]) {
          grammar.addProduction(state, sym + nextState);
        }
      }
    }
    return grammar;
  }

  /**
   * Utility method to print all transitions.
   */
  printTransitions(): void {
    console.log("Transitions:");
    for (let state of this.states) {
      for (let sym of this.alphabet) {
        let targets = Array.from(this.transitions[state][sym]);
        if (targets.length > 0) {
          console.log(`${state} --${sym}--> ${targets.join(', ')}`);
        }
      }
    }
  }
}

/**
 * RegularGrammar class holds production rules.
 * Productions are stored as a mapping from a non-terminal (state) to
 * an array of production strings.
 */
class RegularGrammar {
  productions: { [nonTerminal: string]: string[] };

  constructor() {
    this.productions = {};
  }

  addProduction(nonTerminal: string, production: string) {
    if (!this.productions[nonTerminal]) {
      this.productions[nonTerminal] = [];
    }
    this.productions[nonTerminal].push(production);
  }

  toString(): string {
    let result = "";
    for (let nonTerminal in this.productions) {
      let prods = this.productions[nonTerminal].join(" | ");
      result += `${nonTerminal} -> ${prods}\n`;
    }
    return result;
  }
}

/**
 * --- Variant Data ---
 * Q = {q0, q1, q2, q3},
 * ∑ = {a, b},
 * F = {q2},
 * δ(q0, a) = q0,
 * δ(q0, a) = q1,
 * δ(q1, a) = q2,
 * δ(q1, b) = q1,
 * δ(q2, a) = q3,
 * δ(q3, a) = q1.
 */
const states = ["q0", "q1", "q2", "q3"];
const alphabet = ["a", "b"];
const initialState = "q0";
const finalStates = ["q2"];

const transitions = [
  { from: "q0", symbol: "a", to: "q0" },
  { from: "q0", symbol: "a", to: "q1" },
  { from: "q1", symbol: "a", to: "q2" },
  { from: "q1", symbol: "b", to: "q1" },
  { from: "q2", symbol: "a", to: "q3" },
  { from: "q3", symbol: "a", to: "q1" },
];

// Create the NDFA instance using the variant data.
const ndfa = new FiniteAutomaton(states, alphabet, initialState, finalStates, transitions);

console.log("NDFA Transitions:");
ndfa.printTransitions();

console.log("\nIs the NDFA deterministic?", ndfa.isDeterministic());

// Convert NDFA to DFA.
const dfa = ndfa.convertToDFA();
console.log("\nDFA Transitions:");
dfa.printTransitions();
console.log("\nDFA Final States:", Array.from(dfa.finalStates));

// Convert the automaton to a Regular Grammar.
const regularGrammar = ndfa.toRegularGrammar();
console.log("\nRegular Grammar:");
console.log(regularGrammar.toString());
