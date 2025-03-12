# Finite Automata

### Course: Formal Languages & Finite Automata
### Author: Postoronca Dumitru

----

## Theory

A finite automaton is a mechanism used to represent processes of different kinds. It can be compared to a state machine as they both have similar structures and purpose as well. The word finite signifies the fact that an automaton comes with a starting and a set of final states. In other words, for process modeled by an automaton has a beginning and an ending.
- Based on the structure of an automaton, there are cases in which with one transition multiple states can be reached which causes non determinism to appear. In general, when talking about systems theory the word determinism characterizes how predictable a system is. If there are random variables involved, the system becomes stochastic or non deterministic.
- That being said, the automata can be classified as non-/deterministic, and there is in fact a possibility to reach determinism by following algorithms which modify the structure of the automaton.

A **Deterministic Finite Automaton (DFA)** and a **Nondeterministic Finite Automaton (NDFA or NFA)** are both finite state machines used in automata theory to recognize patterns in strings. A DFA has exactly one transition for each symbol from a given state, making its execution deterministic. In contrast, an NDFA allows multiple transitions for the same input or even ε-transitions (moves without consuming input), introducing nondeterminism. Despite these differences, both have equivalent computational power since any NDFA can be converted into a DFA. However, DFAs may require exponentially more states than their NFA counterparts, making NFAs more space-efficient in certain scenarios.
    
## Objectives:

Understand what an automaton is and what it can be used for.

Continuing the work in the same repository and the same project, the following need to be added: a. Provide a function in your grammar type/class that could classify the grammar based on Chomsky hierarchy.

b. For this you can use the variant from the previous lab.

According to your variant number (by universal convention it is register ID), get the finite automaton definition and do the following tasks:

a. Implement conversion of a finite automaton to a regular grammar.

b. Determine whether your FA is deterministic or non-deterministic.

c. Implement some functionality that would convert an NDFA to a DFA.

d. Represent the finite automaton graphically (Optional, and can be considered as a bonus point):

You can use external libraries, tools or APIs to generate the figures/diagrams.

Your program needs to gather and send the data about the automaton and the lib/tool/API return the visual representation.

Please consider that all elements of the task 3 can be done manually, writing a detailed report about how you've done the conversion and what changes have you introduced. In case if you'll be able to write a complete program that will take some finite automata and then convert it to the regular grammar - this will be a good bonus point.

## Implementation description

### Finite Automaton Data Structure

The implementation defines a `FiniteAutomaton` class that stores:
- **States**: Represented as a set of strings.
- **Alphabet**: Stored as a set of input symbols.
- **Initial and Final States**: The initial state is stored as a string while the final states are maintained in a set.
- **Transitions**: A nested map structure (`TransitionMap`) is used where for every state and symbol, a set of possible next states is maintained.

### Determinism Check

The method `isDeterministic()` in the `FiniteAutomaton` class iterates over each state and input symbol. It verifies that for every (state, symbol) pair there is at most one destination state. If more than one state is found for any such pair, the automaton is non-deterministic. This is crucial because a deterministic finite automaton (DFA) requires a unique next state for every combination of state and input symbol.

### NFA to DFA Conversion

To convert the NFA to a DFA, the **subset construction algorithm** is used:
- **Subset Representation**: Each DFA state is represented as a comma-separated string of NFA states (e.g., `"q0,q1,q2"`).
- **Processing Queue**: A queue is used to systematically explore all subsets of NDFA states.
- **Final States**: A subset is marked as a final state if it contains any NFA final state.
- **Transitions**: For every subset and input symbol, the set of reachable NFA states is computed and then mapped to a new DFA state.

Here you can see the relevant methods that responds for convertion:
```typescript
convertToDFA(): FiniteAutomaton {
    let dfaStates = new Set<string>();
    let dfaFinalStates = new Set<string>();
    let dfaTransitions: { from: string; symbol: InputSymbol; to: string }[] = [];

    let queue: string[] = [];

    const stateSetToString = (states: Set<State>): string => {
      return Array.from(states).sort().join(',');
    };

    //NFA initial state
    let startSet = new Set<State>();
    startSet.add(this.initialState);
    let startStateStr = stateSetToString(startSet);
    dfaStates.add(startStateStr);
    queue.push(startStateStr);

    //process each subset in the queue.
    while (queue.length > 0) {
      let current = queue.shift()!;
      let currentSet = new Set<State>(current.split(',').filter(s => s));

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
          continue; //no transition for this symbol.
        }
        let nextStateStr = stateSetToString(nextSet);
        dfaTransitions.push({ from: current, symbol: sym, to: nextStateStr });
        if (!dfaStates.has(nextStateStr)) {
          dfaStates.add(nextStateStr);
          queue.push(nextStateStr);
        }
      }
    }

    //return new DFA as a FiniteAutomaton.
    return new FiniteAutomaton(
      Array.from(dfaStates),
      Array.from(this.alphabet),
      startStateStr,
      Array.from(dfaFinalStates),
      dfaTransitions
    );
  }
```

For example, the DFA final states you observed:
- **"q0,q1,q2"**: Represents a state where the NDFA can be in states `q0`, `q1`, or `q2`.
- **"q0,q1,q2,q3"**: Represents a state where the NDFA can be in states `q0`, `q1`, `q2`, and `q3`.
- **"q2"**: Represents a state where the NDFA is solely in state `q2`.

Each of these is final since they include `q2`, which is a final state in the original NDFA.

### Conversion to Regular Grammar

The method `toRegularGrammar()` converts the automaton into a regular grammar by:
- Creating a production for each transition of the form **A → aB** (where A is the current state, a is the input symbol, and B is the target state).
- Adding a production **A → ε** for each final state A.
  
Here is the method that responds for converstion:
```typescript
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
```

This transformation follows the standard method of converting a finite automaton to a regular grammar, ensuring that the language generated by the grammar is the same as that accepted by the automaton.

---
## Results 

Below you can see the results after the run of the algorithm:
```typescript
NDFA Transitions:
Transitions:
q0 --a--> q0, q1
q1 --a--> q2
q1 --b--> q1
q2 --a--> q3
q3 --a--> q1

Is the NDFA deterministic? false

DFA Transitions:
Transitions:
q0 --a--> q0,q1
q0,q1 --a--> q0,q1,q2
q0,q1 --b--> q1
q0,q1,q2 --a--> q0,q1,q2,q3
q0,q1,q2 --b--> q1
q1 --a--> q2
q1 --b--> q1
q0,q1,q2,q3 --a--> q0,q1,q2,q3
q0,q1,q2,q3 --b--> q1
q2 --a--> q3
q3 --a--> q1

DFA Final States: [ 'q0,q1,q2', 'q0,q1,q2,q3', 'q2' ]

Regular Grammar:
q0 -> aq0 | aq1
q1 -> aq2 | bq1
q2 -> ε | aq3
q3 -> aq1
```

## Conclusion

In conclusion I can say that I got a good experience developing this NFA to DFA convertor and got a good knowledge about how it should done correctly. These are the key conclusions that I got from this laboratory work:

- **Modularity and Clarity** - The implementation divides the automaton functionality into distinct methods that address determinism checking, conversion to DFA, and regular grammar transformation. This modular design facilitates easier debugging and potential future enhancements, such as graphical representation.
- **NDFA to DFA Conversion** - The subset construction algorithm efficiently handles non-determinism by representing multiple NDFA states as a single DFA state. The generated DFA final states are intuitive: any state subset that includes at least one NDFA final state is marked as final.
- **Regular Grammar Equivalence** - The conversion to regular grammar demonstrates a practical application of automata theory, providing a clear link between automata and grammar representations in the Chomsky hierarchy.
- **Potential Extensions** - Future work could include implementing unit tests, adding a graphical visualization of the automaton, or generalizing the approach for a wider range of automata.

Overall, the project provides a comprehensive framework for working with finite automata, demonstrating essential concepts of determinism, NDFA-to-DFA conversion, and the transformation to a regular grammar.
