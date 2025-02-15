import { Grammar } from "../utils/grammar";
describe("test of finite automaton", ()=>{
  var finiteAutomaton = new Grammar(
    ["S", "A", "B"], 
    ["a", "b", "c", "d"],
    {
        "S": ["bS", "dA"],
        "A": ["aA", "dB", "b"],
        "B": ["cB", "a"]
    },
    "S"
  ).toFiniteAutomaton()
  test("valid strings", ()=>{
    expect(finiteAutomaton.stringBelongToLanguage("dada")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bbbbbbbdb")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("daadca")).toBe(true)
    expect(finiteAutomaton.stringBelongToLanguage("bddca")).toBe(true)
  })
  test("invalid strings", ()=>{
    expect(finiteAutomaton.stringBelongToLanguage("ababacccdcaaa")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("abcdacbcba")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("bcdabcdbaacbd")).toBe(false)
    expect(finiteAutomaton.stringBelongToLanguage("bcdabcbadbca")).toBe(false)
  })
})
