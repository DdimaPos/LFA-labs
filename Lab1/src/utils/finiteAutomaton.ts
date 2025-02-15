export class FiniteAutomaton {
    states: Set<string>;
    alphabet: Set<string>;
    transitions: Map<string, Map<string, string>>; // δ: (state, symbol) -> nextState
    startState: string; // q0
    finalStates: Set<string>; // F

    constructor(states: string[], alphabet: string[], transitions: Map<string, Map<string, string>>, startState: string, finalStates: string[]) {
        this.states = new Set(states);
        this.alphabet = new Set(alphabet);
        this.transitions = transitions;
        this.startState = startState;
        this.finalStates = new Set(finalStates);
    }

    // Check if a given input string is accepted by the FA
    public stringBelongToLanguage(input: string): boolean {
        let currentState = this.startState;

        for (const symbol of input) {
            if (!this.alphabet.has(symbol)) return false; // Invalid symbol
            
            const stateTransitions = this.transitions.get(currentState);
            if (!stateTransitions || !stateTransitions.has(symbol)) return false; // No valid transition
            
            currentState = stateTransitions.get(symbol)!;
        }

        return this.finalStates.has(currentState); // Check if we end in a final state
    }
}

