//Variant 25:
//VN={S, A, B},
//VT={a, b, c, d},
//P={
//    S → bS
//    S → dA
//    A → aA
//    A → dB
//    B → cB
//    A → b
//    B → a
//}

import { Grammar } from "./utils/grammar";

const grammar = new Grammar(
    ["S", "A", "B"], 
    ["a", "b", "c", "d"],
    {
        "S": ["bS", "dA"],
        "A": ["aA", "dB", "b"],
        "B": ["cB", "a"]
    },
    "S"
);

for (let i = 0; i < 5; i++) {
    console.log(grammar.generateString());
}

const finiteAutomaton = grammar.toFiniteAutomaton();

//some strings for testing
console.log(finiteAutomaton.stringBelongToLanguage("dada")); //true
console.log(finiteAutomaton.stringBelongToLanguage("bbddca")); //true
console.log(finiteAutomaton.stringBelongToLanguage("abc")); //false
console.log(finiteAutomaton.stringBelongToLanguage("dabb")); //false
