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
})
