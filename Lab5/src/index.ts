import fs from "node:fs";
import { GrammarSymbol, Production, Grammar } from "./types";
import { arraysEqual } from "./utils/arrays_equal";

class CNFConverter {
  grammar: Grammar;

  constructor(grammar: Grammar) {
    this.grammar = { ...grammar };
  }

  toCNF(): Grammar {
    this.removeEpsilonProductions();
    this.removeUnitProductions();
    this.removeNonProductiveSymbols();
    this.removeInaccessibleSymbols();
    this.convertToCNF();
    return this.grammar;
  }

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

  private removeNonProductiveSymbols() {
    const productive = new Set<GrammarSymbol>();
    let changed = true;

    while (changed) {
      changed = false;
      for (const [lhs, rhs] of this.grammar.P) {
        if (
          rhs.every((s) => this.grammar.VT.includes(s) || productive.has(s))
        ) {
          if (!productive.has(lhs)) {
            productive.add(lhs);
            changed = true;
          }
        }
      }
    }

    this.grammar.P = this.grammar.P.filter(
      ([lhs, rhs]) =>
        productive.has(lhs) &&
        rhs.every((s) => this.grammar.VT.includes(s) || productive.has(s)),
    );

    this.grammar.VN = this.grammar.VN.filter((sym) => productive.has(sym));
  }

  private removeInaccessibleSymbols() {
    const accessible = new Set<GrammarSymbol>([this.grammar.S]);
    let changed = true;

    while (changed) {
      changed = false;
      for (const [lhs, rhs] of this.grammar.P) {
        if (accessible.has(lhs)) {
          for (const sym of rhs) {
            if (this.grammar.VN.includes(sym) && !accessible.has(sym)) {
              accessible.add(sym);
              changed = true;
            }
          }
        }
      }
    }

    this.grammar.P = this.grammar.P.filter(([lhs]) => accessible.has(lhs));
    this.grammar.VN = this.grammar.VN.filter((sym) => accessible.has(sym));
  }

  private convertToCNF() {
    const newProductions: Production[] = [];
    const newVars: Record<string, GrammarSymbol> = {};
    let varCount = 1;

    const getOrCreateVar = (term: GrammarSymbol): GrammarSymbol => {
      if (!newVars[term]) {
        const newVar = `X${varCount++}`;
        this.grammar.VN.push(newVar);
        newProductions.push([newVar, [term]]);
        newVars[term] = newVar;
      }
      return newVars[term];
    };

    for (const [lhs, rhs] of this.grammar.P) {
      if (rhs.length === 1 && this.grammar.VT.includes(rhs[0])) {
        newProductions.push([lhs, rhs]);
      } else {
        const newRHS = rhs.map((sym) =>
          this.grammar.VT.includes(sym) ? getOrCreateVar(sym) : sym,
        );
        while (newRHS.length > 2) {
          const newVar = `X${varCount++}`;
          this.grammar.VN.push(newVar);
          newProductions.push([newVar, newRHS.splice(0, 2)]);
          newRHS.unshift(newVar);
        }
        newProductions.push([lhs, newRHS]);
      }
    }

    this.grammar.P = newProductions;
  }

  private getAllSubsets(arr: number[]): number[][] {
    const subsets: number[][] = [];
    const total = 1 << arr.length;

    for (let i = 1; i < total; i++) {
      const subset: number[] = [];
      for (let j = 0; j < arr.length; j++) {
        if ((i & (1 << j)) !== 0) subset.push(arr[j]);
      }
      subsets.push(subset);
    }

    return subsets;
  }
}

const grammar: Grammar = {
  VN: ["S", "A", "B", "C", "D"],
  VT: ["a", "b"],
  S: "S",
  P: [
    ["S", ["b", "A"]],
    ["S", ["B", "C"]],
    ["A", ["a"]],
    ["A", ["a", "S"]],
    ["A", ["b", "C", "a", "C", "a"]],
    ["B", ["A"]],
    ["B", ["b", "S"]],
    ["B", ["b", "C", "A", "a"]],
    ["C", ["ε"]],
    ["C", ["A", "B"]],
    ["D", ["A", "B"]],
  ],
};

const converter = new CNFConverter(grammar);
const cnfGrammar = converter.toCNF();

console.log(JSON.stringify(cnfGrammar, null, 1));

fs.writeFile(
  "mynewfile3.json",
  JSON.stringify(cnfGrammar, null, 1),
  function(err) {
    console.log(err);
  },
);
