# Regular Expressions and Their Applications

### Course: Formal Languages & Finite Automata

### Author: Postoronca Dumitru

---

## Theory

Regular expressions are a powerful tool used for pattern matching and text processing. They define a formal language by describing patterns of strings within a set of possible strings. Regular expressions are widely used in various applications, such as:

- **Lexical Analysis:** Tokenizing input in compilers and interpreters.
- **Text Processing:** Searching, replacing, and extracting substrings from text data.
- **Data Validation:** Ensuring data conforms to specific formats (e.g., email addresses, phone numbers).
- **String Parsing:** Extracting specific patterns from large datasets.

Regular expressions are often implemented using **finite automata**, where a pattern can be recognized by a **Deterministic Finite Automaton (DFA)** or a **Nondeterministic Finite Automaton (NFA)**.

## Objectives

- Understand the concept and use cases of regular expressions.
- Implement a program that generates valid combinations of symbols based on given regular expressions.
- Apply constraints to limit generation where necessary.
- (Bonus) Implement a function that shows the sequence of processing a regular expression.

## Implementation Description

The solution consists of a Typescript functions that generate valid combinations of symbols according to predefined regular expressions. The program follows these steps:

1. **Creating a data structure to save the information about the generated strings**
   - The outputs are saved into an Array of objects. Interface for that object is declared in `index.ts` file and looks like this
     ```
     interface generationExample{
       pattern1: string,
       pattern2: string,
       pattern3: string,
     }
     var table: generationExample[]
     ```
2. **Generating Valid Strings**:
   - Randomly select characters according to the given pattern rules.
   - Repeat specific characters a limited number of times to avoid excessively long outputs.
3. **Output Display**:
   - Generated strings are printed to the console and displayed in a Table.

### **Code Implementation**

```ts
//pattern1
export const pattern1 = ():string =>{
  var generated_string:string;
  var a_b: string = Math.random() < 0.5 ?"a":"b";
  var c_d: string = Math.random() < 0.5?"c":"b";
  var n_of_repeats = Math.ceil(Math.random()*5) + 1;
  var E = "E".repeat(n_of_repeats)
  generated_string=`${a_b}${c_d}${E}G`
  return generated_string;
}

//pattern2
export const pattern2 = (): string => {
  var generated_string: string;
  let QRS: string = ["Q", "R", "S"][Math.floor(Math.random() * 3)];
  let UVWX: string = (
    Math.random() < 0.33 ? "UV" : Math.random() < 0.66 ? "W" : "X"
  ).repeat(Math.floor(Math.random() * 6));
  let Z: string = "Z".repeat(Math.floor(Math.random() * 5) + 1);

  generated_string = `P${QRS}T${UVWX}${Z}`;
  return generated_string;
};

//pattern3
export const pattern3 = (): string => {
  var generated_string: string;
  var bin:string = (Math.random() < 0.5 ? "0" : "1").repeat(Math.ceil(Math.random() * 5) + 1);
  var rep34:string = (Math.random() < 0.5 ? "3" : "4").repeat(5);

  generated_string = `1${bin}2${rep34}36`;
  return generated_string;
};
```

### **Explanation of Code**

- **Pattern 1:**
  - Begins with 'a' or 'b'.
  - Followed by 'c' or 'd'.
  - Includes 'E' repeated a random number of times (1-5 times).
  - Ends with 'G'.
- **Pattern 2:**
  - Starts with 'P'.
  - Followed by 'Q', 'R', or 'S'.
  - Includes a repeating sequence of 'UV', 'W', or 'X'.
  - Ends with multiple occurrences of 'Z'.
- **Pattern 3:**
  - Begins with '1'.
  - Contains a repeated binary sequence ('0' or '1').
  - Ends with a sequence of five repetitions of '3' or '4'.
  - Finishes with '36'.

## Conclusions / Results

### **Conclusions**

The program successfully generates valid sequences based on the given regular expressions. The structured approach ensures:

- Compliance with predefined patterns.
- Prevention of excessively long sequences by applying repetition constraints.

### **Generated Output Example:**

```
┌─────────┬─────────────┬─────────────────────┬───────────────────┐
│ (index) │ pattern1    │ pattern2            │ pattern3          │
├─────────┼─────────────┼─────────────────────┼───────────────────┤
│ 0       │ 'abEEEEEEG' │ 'PQTUVZZZ'          │ '100000024444436' │
│ 1       │ 'abEEEEEEG' │ 'PQTUVUVUVUVZZZZ'   │ '111124444436'    │
│ 2       │ 'acEEEG'    │ 'PQTWWZZZZ'         │ '11111123333336'  │
│ 3       │ 'acEEEEEEG' │ 'PRTUVUVUVZZZ'      │ '1111123333336'   │
│ 4       │ 'bcEEEG'    │ 'PSTXXZZZZZ'        │ '11123333336'     │
│ 5       │ 'acEEEEG'   │ 'PQTZZZZ'           │ '111111123333336' │
│ 6       │ 'abEEEEG'   │ 'PQTWWWWWZ'         │ '111111123333336' │
│ 7       │ 'bbEEEEG'   │ 'PSTWZZ'            │ '100024444436'    │
│ 8       │ 'abEEEG'    │ 'PSTXXXXZZZ'        │ '100023333336'    │
│ 9       │ 'acEEEEEEG' │ 'PQTWZZZZZ'         │ '10024444436'     │
│ 10      │ 'acEEEEEEG' │ 'PRTUVZZZZ'         │ '11111124444436'  │
│ 11      │ 'abEEG'     │ 'PRTWWWZ'           │ '111123333336'    │
│ 12      │ 'bbEEEG'    │ 'PRTUVUVZZZ'        │ '100000024444436' │
│ 13      │ 'bbEEG'     │ 'PSTWZ'             │ '10000023333336'  │
│ 14      │ 'bcEEEG'    │ 'PQTXXXXXZZ'        │ '10000023333336'  │
│ 15      │ 'abEEG'     │ 'PQTZZZZZ'          │ '11123333336'     │
│ 16      │ 'bbEEEEEG'  │ 'PRTUVUVUVUVUVZZ'   │ '111124444436'    │
│ 17      │ 'abEEEEEEG' │ 'PRTWZZZZ'          │ '1111123333336'   │
│ 18      │ 'bbEEEG'    │ 'PQTWWWZZZZ'        │ '1111123333336'   │
│ 19      │ 'abEEEEEEG' │ 'PSTZZ'             │ '1111123333336'   │
│ 20      │ 'bbEEG'     │ 'PQTXXXZ'           │ '10024444436'     │
│ 21      │ 'abEEEEG'   │ 'PQTUVUVUVUVUVZZ'   │ '11124444436'     │
│ 22      │ 'acEEEEEEG' │ 'PQTUVUVUVUVUVZZZZ' │ '111111124444436' │
│ 23      │ 'acEEG'     │ 'PSTZZZZ'           │ '11111123333336'  │
│ 24      │ 'bbEEEEEEG' │ 'PRTZZZZ'           │ '1000023333336'   │
│ 25      │ 'bcEEEEG'   │ 'PRTWZ'             │ '1000024444436'   │
│ 26      │ 'acEEEG'    │ 'PSTUVUVZZZZ'       │ '111111124444436' │
│ 27      │ 'abEEEEEEG' │ 'PRTWWZZZZ'         │ '11111124444436'  │
│ 28      │ 'acEEEEEEG' │ 'PRTUVUVZZZ'        │ '111124444436'    │
│ 29      │ 'bbEEEEEEG' │ 'PSTXXXZZZZ'        │ '100000023333336' │
│ 30      │ 'bbEEEEEEG' │ 'PRTWWWWZ'          │ '111123333336'    │
│ 31      │ 'acEEEEG'   │ 'PSTWWZZZZZ'        │ '100023333336'    │
│ 32      │ 'bbEEEG'    │ 'PSTWWWZZZZZ'       │ '100000024444436' │
│ 33      │ 'abEEEEEEG' │ 'PSTXXXXXZ'         │ '10000023333336'  │
│ 34      │ 'bbEEEEG'   │ 'PRTWWWWZZZZ'       │ '1111124444436'   │
│ 35      │ 'bbEEG'     │ 'PQTUVUVUVZZZZZ'    │ '1111124444436'   │
│ 36      │ 'bbEEG'     │ 'PSTWWWZZ'          │ '1000024444436'   │
│ 37      │ 'acEEEEEEG' │ 'PRTWWZZZZ'         │ '1000023333336'   │
│ 38      │ 'bbEEEEEG'  │ 'PQTWZ'             │ '100000024444436' │
│ 39      │ 'bcEEEG'    │ 'PQTXZZZZZ'         │ '111123333336'    │
└─────────┴─────────────┴─────────────────────┴───────────────────┘
```

This demonstrates that different combinations of symbols are generated while maintaining structure constraints.

