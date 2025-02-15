# Intro to formal languages. Regular grammars. Finite Automata.

### Course: Formal Languages & Finite Automata

### Author: Postoronca Dumitru FAF-233 Variant 25

---

## Theory

Regular grammar and finite automata where the building components of the current laboratory work:

- **Regular grammar** - set of rules that establishes which rules the language is supposed to follow. Expressing those rules is done by 4 building components:

  1. _Non terminal symbols_ - Symbols from which the conversion can be done
  2. _Terminal symbols_ - Symbols to which the conversion is done
  3. _Production rules_ - Rules of how non-terminal symbols are converted to terminal symbols
  4. _Starting symbol_ - A chosen symbol from Non-terminal symbols from which convertion starts

- **Finite automata** - Checker that can identify if a terminate string can belong to the language. This works by reading the input symbol by symbols and modifying the state of finite automata. If the current state reaches the final state, then the string belongs to the language

## Objectives:

Discover what a language is and what it needs to have in order to be considered a formal one;

Provide the initial setup for the evolving project that you will work on during this semester. You can deal with each laboratory work as a separate task or project to demonstrate your understanding of the given themes, but you also can deal with labs as stages of making your own big solution, your own project. Do the following:

  a. Create GitHub repository to deal with storing and updating your project;
  b. Choose a programming language. Pick one that will be easiest for dealing with your tasks, you need to learn how to solve the problem itself, not everything around the problem (like setting up the project, launching it correctly and etc.);
  c. Store reports separately in a way to make verification of your work simpler (duh)

According to your variant number, get the grammar definition and do the following:

  a. Implement a type/class for your grammar;
  b. Add one function that would generate 5 valid strings from the language expressed by your given grammar;
  c. Implement some functionality that would convert and object of type Grammar to one of type Finite Automaton;
  d. For the Finite Automaton, please add a method that checks if an input string can be obtained via the state transition from it;

## Implementation description

Solution is written in Typescript. Below you will find the *Installation guide* and *Solution description*

### Installation guide

Clone the repository and checkout to the lab1 branch
```
cd lab1
npm i 
# to compile into javascript
npx tsx 
# to run compiled js
node dist/index.js
# run tests
npm test
```

### Solution description

As the solution I decided to create 2 classes to follow the guideline. `Grammar` and `FiniteAutomaton`. Both of them can be found in `src/utils/` directory.

FiniteAutomaton has a primary method called `stringBelongToLanguage` which returns a boolean. It iterates through each symbol of the input string:

  1. If the symbol is not in the alphabet, the function immediately returns false (invalid input).
  2. Check if a transition exists for the currentState and symbol. If not, return false (no valid transition).
  3. Update currentState to the next state according to the transition function.

Regular grammar implementation (specifically string generation) relies on random chosing of the production rule recursively, this is why at each run, the output can be different.
Another method of the `Grammar` class is convertion to `FiniteAutomaton`. First step was creating the parameters for the constructor function and then returning the `FiniteAutomaton` instance.

For testing I decided to create a few unit tests with valid inputs and invalid inputs to test the finite automaton. The result of the `generateString` function you can see by running the `index.ts` file.

## Conclusions / Screenshots / Results

It was interesting to understand this topic, because I didn't really understood the difference between the Regular Grammar and Finite Automaton.

### Regular grammar results 

Here are the random string generation results
```
dda
bbdb
bddca
daaada
db
bbdb
db
db
bbbbbdab
bbddca
bbdb
db
db
bbbbbdab
bbddca
```

### Finite automaton results

Tests:
```
test("valid strings", ()=>{
    expect(finiteAutomaton.stringBelongToLanguage("dada")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbbbbbdb")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("daadca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bddca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbbbdab")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("db")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbddca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbbddcca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbddccca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbbbbbbbbbbbbbbbbbddccca")).toBe(true)
  })
  test("invalid strings", ()=>{
    expect(finiteAutomaton.stringBelongToLanguage("ababacccdcaaa")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("abcdacbcba")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("bcdabcdbaacbd")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("bcdabcbadbca")).toBe(false)
  })
  test("symbols not from the alphabet", ()=>{
    expect(finiteAutomaton.stringBelongToLanguage("hreuiwgheroig")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("vnbeqyup")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("jiurehqgoerb")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("ouirewvgqe98v")).toBe(false)
  })

```

Result of the unit tests:
```
PASS  src/tests/finiteAutomaton.test.ts
  test of finite automaton
    ✓ valid strings (4 ms)
    ✓ invalid strings
    ✓ symbols not from the alphabet

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.36 s
Ran all test suites.
```

## References

- [Difference between regular grammar and finite automaton - Quora](https://www.quora.com/What-is-the-difference-between-finite-automata-and-regular-expressions-What-are-their-similarities-and-differences#:~:text=They%20are%20similar%20to%20regular,it%20comes%20to%20matching%20strings.)
