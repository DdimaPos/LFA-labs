# Chomsky Normal Form

### Course: Formal Languages & Finite Automata

### Author: Postoronca Dumitru

---

## Theory

Regular expressions are a powerful tool used for pattern matching and text processing. They define a formal
language by describing patterns of strings within a set of possible strings. Regular expressions are
widely used in various applications, such as:

- **Lexical Analysis:** Tokenizing input in compilers and interpreters.
- **Text Processing:** Searching, replacing, and extracting substrings from text data.
- **Data Validation:** Ensuring data conforms to specific formats (e.g., email addresses, phone numbers).
- **String Parsing:** Extracting specific patterns from large datasets.

Regular expressions are often implemented using **finite automata**, where a pattern can be recognized
by a **Deterministic Finite Automaton (DFA)** or a **Nondeterministic Finite Automaton (NFA)**.

## Objectives

- Understand the concept and use cases of regular expressions.
- Implement a program that generates valid combinations of symbols based on given regular expressions.
- Apply constraints to limit generation where necessary.
- (Bonus) Implement a function that shows the sequence of processing a regular expression.

## Implementation Description

The implementation provides a TypeScript class that transforms a given context-free grammar
into its Chomsky Normal Form (CNF), following a step-by-step normalization process.
The grammar is defined as a tuple 𝐺=(𝑉𝑁,𝑉𝑇,𝑃,𝑆) where:

- VN is the set of non-terminal symbols,
- VT is the set of terminal symbols,
- P is the set of production rules, and
- S is the start symbol.

Implemented Steps
The conversion process is encapsulated in the toCNF() method and currently includes the following key transformations:

The implementation sequentialy implements step by step the transformation algorithm of the
Chiomsky Normal Form. Below you can see the steps thet are simulated:

1. Removing all epsilon productions
2. Remove Unit Productions
3. RemoveNonProductive Symbols
4. Removing Innaccessible Symbols
5. Final steps of converting the grammar to the Chomskuy Normal form

### **Code Implementation**

The grammar is modeled using TypeScript types for strong type-checking and clarity.

Each transformation is implemented as a private method in the class, keeping the logic encapsulated and modular.

Utility functions (e.g., `getAllSubsets`, `arraysEqual`) support combinatorial generation and deep comparison.

### **Explanation of Code**

#### `toCNF()` Method

This is the main driver function that applies all the transformation steps. Right now, it calls:

```ts
this.removeEpsilonProductions();
this.removeUnitProductions();
```

Each method transforms the grammar step-by-step. The result is returned as a modified version of the original grammar.

---

### `removeEpsilonProductions()`

This function eliminates ε-productions (productions where the right-hand side is just `ε`) in the following steps:

1. **Identify nullable symbols**

   - A symbol is _nullable_ if it can derive ε (either directly or indirectly).
   - This is done using a loop that keeps adding symbols to the `nullable` set until no changes occur.

2. **Generate new productions without nullable symbols**

   - For each production, find all combinations where nullable symbols are optionally omitted.
   - This is done by generating **all subsets** of indexes for nullable symbols and filtering them out from the RHS.
   - For example, if you have a production like `A → B C D`, and `C` is nullable, this would generate:
     - `A → B D` (with `C` removed)
     - `A → B C D` (original retained)

3. **Skip direct ε-productions:**
   - Productions like `A → ε` are removed unless necessary for the start symbol.

```ts

  private removeEpsilonProductions() {
    const nullable = new Set<GrammarSymbol>();
    const newProductions: Production[] = [];
    let changed = true;

    while (changed) {
      changed = false;
      for (const [lhs, rhs] of this.grammar.P) {
        if (rhs.includes("ε") || rhs.every((s) => nullable.has(s))) {
          if (!nullable.has(lhs)) {
            nullable.add(lhs);
            changed = true;
          }
        }
      }
    }

    for (const [lhs, rhs] of this.grammar.P) {
      if (rhs.includes("ε") && rhs.length === 1) continue;

      const indexes = rhs
        .map((s, i) => (nullable.has(s) ? i : -1))
        .filter((i) => i >= 0);
      const subsets = this.getAllSubsets(indexes);

      for (const subset of subsets) {
        const newRHS = rhs.filter((_, i) => !subset.includes(i));
        if (newRHS.length > 0) {
          newProductions.push([lhs, [...newRHS]]);
        }
      }

      newProductions.push([lhs, [...rhs]]);
    }

    this.grammar.P = newProductions;
  }

```

---

### `removeUnitProductions()`

This function removes _unit productions_, which are rules like `A → B`, where both are non-terminals
in the following steps

1. **Build a unit graph**

   - For every unit production `A → B`, we add a connection in a map (`unitGraph`).
   - This map stores which non-terminals are reachable from each other via unit productions.

2. **Find all reachable unit pairs using DFS**

   - For each non-terminal, find all others it can reach through unit rules. This forms the transitive closure.

3. **Rebuild the production list**

   - Keep all non-unit rules.
   - For each pair `A →* B`, copy every **non-unit** production from `B` to `A`.

4. **Avoid duplicates**
   - Before adding a new production, it checks whether it's already present using an `arraysEqual` utility.

```ts
  private removeUnitProductions() {
    //build the unit production graph.
    const unitGraph = new Map<GrammarSymbol, Set<GrammarSymbol>>();
    for (const A of this.grammar.VN) {
      unitGraph.set(A, new Set());
    }

    //popul. graph with direct producs.
    for (const [lhs, rhs] of this.grammar.P) {
      if (rhs.length === 1 && this.grammar.VN.includes(rhs[0])) {
        unitGraph.get(lhs)?.add(rhs[0]);
      }
    }

    //transitive closure for unit productions.
    const unitPairs = new Map<GrammarSymbol, Set<GrammarSymbol>>();
    for (const A of this.grammar.VN) {
      const visited = new Set<GrammarSymbol>();
      const stack: GrammarSymbol[] = [A];
      while (stack.length > 0) {
        const current = stack.pop()!;
        for (const neighbor of unitGraph.get(current) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            stack.push(neighbor);
          }
        }
      }
      unitPairs.set(A, visited);
    }

    //new set of prods without direct unit prods
    const newProductions: Production[] = [];
    for (const [lhs, rhs] of this.grammar.P) {
      //add id not unit productions.
      if (!(rhs.length === 1 && this.grammar.VN.includes(rhs[0]))) {
        newProductions.push([lhs, rhs]);
      }
    }

    /*for each nonterminal A, and for each nonterminal B reachable via unit productions,
     add all non-unit productions of B to A.*/
    for (const A of this.grammar.VN) {
      const reachable = unitPairs.get(A) || new Set<GrammarSymbol>();
      for (const B of reachable) {
        for (const [lhs, rhs] of this.grammar.P) {
          if (
            lhs === B &&
            !(rhs.length === 1 && this.grammar.VN.includes(rhs[0]))
          ) {
            if (
              !newProductions.some(([l, r]) => l === A && arraysEqual(r, rhs))
            ) {
              newProductions.push([A, rhs]);
            }
          }
        }
      }
    }

    this.grammar.P = newProductions;
  }

```

---

## Conclusions / Results

### **Conclusions**

In this laboratory work, we explored the transformation of a context-free grammar 
into Chomsky Normal Form (CNF) — a standard form that simplifies parsing and 
theoretical analysis. The process involved several normalization steps, including 
the elimination of ε-productions and unit productions. Each step was carefully 
implemented and encapsulated in a TypeScript class, ensuring a modular and 
reusable structure.

The elimination of ε-productions ensured that the grammar no longer relies on 
empty string derivations, while preserving language equivalence. The removal 
of unit productions prevented infinite derivation chains and simplified the 
grammar structure by collapsing indirect relationships between non-terminals.

This work provided both a theoretical understanding and a practical implementation 
of grammar normalization, emphasizing the importance of formal language 
transformations in compiler design and automata theory. The step-by-step 
method also lays the groundwork for completing the full CNF conversion by 
later adding removal of non-productive and inaccessible symbols, and finally 
restructuring productions to fit CNF’s strict format.

Through this implementation, we demonstrated how complex formal language 
concepts can be made concrete using clean, maintainable code — reinforcing 
both theoretical knowledge and programming proficiency.

### **Generated Output Example:**

Below is the output grammar for variant 25, but the results for other variants can
also be generated.

```json
{
  "VN": [
    "S",
    "A",
    "B",
    "C",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "X8",
    "X9",
    "X10",
    "X11",
    "X12",
    "X13",
    "X14",
    "X15",
    "X16",
    "X17",
    "X18",
    "X19",
    "X20",
    "X21",
    "X22",
    "X23",
    "X24",
    "X25",
    "X26",
    "X27",
    "X28",
    "X29",
    "X30",
    "X31",
    "X32"
  ],
  "VT": ["a", "b"],
  "S": "S",
  "P": [
    ["X1", ["b"]],
    ["S", ["X1", "A"]],
    ["S", ["B", "C"]],
    ["A", ["a"]],
    ["X2", ["a"]],
    ["A", ["X2", "S"]],
    ["X3", ["X1", "X2"]],
    ["X4", ["X3", "C"]],
    ["A", ["X4", "X2"]],
    ["X5", ["X1", "C"]],
    ["X6", ["X5", "X2"]],
    ["A", ["X6", "X2"]],
    ["X7", ["X1", "X2"]],
    ["A", ["X7", "X2"]],
    ["X8", ["X1", "C"]],
    ["X9", ["X8", "X2"]],
    ["X10", ["X9", "C"]],
    ["A", ["X10", "X2"]],
    ["B", ["X1", "S"]],
    ["X11", ["X1", "A"]],
    ["B", ["X11", "X2"]],
    ["X12", ["X1", "C"]],
    ["X13", ["X12", "A"]],
    ["B", ["X13", "X2"]],
    ["C", ["A", "B"]],
    ["S", ["X1", "S"]],
    ["X14", ["X1", "A"]],
    ["S", ["X14", "X2"]],
    ["X15", ["X1", "C"]],
    ["X16", ["X15", "A"]],
    ["S", ["X16", "X2"]],
    ["S", ["a"]],
    ["S", ["X2", "S"]],
    ["X17", ["X1", "X2"]],
    ["X18", ["X17", "C"]],
    ["S", ["X18", "X2"]],
    ["X19", ["X1", "C"]],
    ["X20", ["X19", "X2"]],
    ["S", ["X20", "X2"]],
    ["X21", ["X1", "X2"]],
    ["S", ["X21", "X2"]],
    ["X22", ["X1", "C"]],
    ["X23", ["X22", "X2"]],
    ["X24", ["X23", "C"]],
    ["S", ["X24", "X2"]],
    ["B", ["a"]],
    ["B", ["X2", "S"]],
    ["X25", ["X1", "X2"]],
    ["X26", ["X25", "C"]],
    ["B", ["X26", "X2"]],
    ["X27", ["X1", "C"]],
    ["X28", ["X27", "X2"]],
    ["B", ["X28", "X2"]],
    ["X29", ["X1", "X2"]],
    ["B", ["X29", "X2"]],
    ["X30", ["X1", "C"]],
    ["X31", ["X30", "X2"]],
    ["X32", ["X31", "C"]],
    ["B", ["X32", "X2"]]
  ]
}
```
