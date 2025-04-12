//Variant 1:
//(a|b)(c|d)E+G?
//P(Q|R|S)T(UV|W|X)*Z+
//1(0|1)*2(3|4)^5 36

import {pattern1} from "./patterns/pattern1" 
import {pattern2} from "./patterns/pattern2" 
import {pattern3} from "./patterns/pattern3" 

interface generationExample{
  pattern1: string,
  pattern2: string,
  pattern3: string,
}


class SimpleRegexGenerator {
    private pattern: string;
    public explanation: string[];

    constructor(pattern: string) {
        this.pattern = pattern;
        this.explanation = [];
    }

    private addExplanation(part: string, explanation: string): void {
        this.explanation.push(`Processing '${part}': ${explanation}`);
    }

    /**
     * Parses the pattern and returns an array of token groups.
     * Each group is an array of string alternatives.
     */
    private parsePattern(): string[][] {
        const parts: string[][] = [];
        let i = 0;

        while (i < this.pattern.length) {
            let token: string[] = [];
            let tokenText = "";

            // Check if the token is a group like (a|b)
            if (this.pattern[i] === '(') {
                const end = this.pattern.indexOf(')', i);
                if (end === -1) throw new Error("Unmatched parenthesis");
                token = this.pattern.slice(i + 1, end).split('|');
                tokenText = this.pattern.slice(i, end + 1);
                this.addExplanation(tokenText, `Either of ${token.join(" or ")} appears exactly once`);
                i = end + 1;
            } else {
                // It's a literal character
                token = [this.pattern[i]];
                tokenText = this.pattern[i];
                this.addExplanation(tokenText, `'${this.pattern[i]}' appears exactly once`);
                i++;
            }

            // Immediately check for repetition operators following the token
            if (i < this.pattern.length) {
                const op = this.pattern[i];

                if (op === '*') {
                    // For * we simulate a random repetition count (0 to 5 times)
                    const repeatCount = Math.floor(Math.random() * 6);
                    token = token.map(x => x.repeat(repeatCount));
                    this.addExplanation(tokenText + '*', `'${tokenText}' appears zero or more times (repeated ${repeatCount} times)`);
                    i++;
                } else if (op === '+') {
                    // For + we simulate a random repetition count (1 to 5 times)
                    const repeatCount = Math.floor(Math.random() * 5) + 1;
                    token = token.map(x => x.repeat(repeatCount));
                    this.addExplanation(tokenText + '+', `'${tokenText}' appears one or more times (repeated ${repeatCount} times)`);
                    i++;
                } else if (op === '?') {
                    // For ? the token is optional (it can appear or not)
                    token = [...token, ''];
                    this.addExplanation(tokenText + '?', `'${tokenText}' is optional`);
                    i++;
                } else if (op === '{') {
                    // Repetition with a fixed count like {3}
                    const end = this.pattern.indexOf('}', i);
                    if (end === -1) throw new Error("Unmatched curly brace");
                    const repeatCount = parseInt(this.pattern.slice(i + 1, end));
                    if (isNaN(repeatCount)) {
                        throw new Error("Invalid number in curly braces");
                    }
                    token = token.map(x => x.repeat(repeatCount));
                    this.addExplanation(this.pattern.slice(i, end + 1), `Previous token appears exactly ${repeatCount} times`);
                    i = end + 1;
                }
            }

            parts.push(token);
        }

        return parts;
    }

    public explainProcess(): void {
        console.log(`\nExplanation for Processing of Pattern ${this.pattern}:`);
        this.explanation.forEach(step => console.log(step));
        console.log("\n");
    }

    private generateRandomString(parts: string[][]): string {
        return parts
            .map(group => group[Math.floor(Math.random() * group.length)])
            .join('');
    }

    public generateMultipleStrings(count: number): string[] {
        const parts = this.parsePattern();
        return Array.from({ length: count }, () => this.generateRandomString(parts));
    }
}
////const pattern = '1(0|1)*2(3|4){5}36';
//const pattern = 'P(Q|R|S)T(UV|W|X)*Z+';
////const pattern = '1(0|1)*2(3|4){5}36';
//const generator = new SimpleRegexGenerator(pattern);
//console.log("hello")
//const generatedStrings = generator.generateMultipleStrings(40);
//
//console.table(generatedStrings)



function Main():void{
  var table: generationExample[] = new Array(40)
  const generator1 = new SimpleRegexGenerator('(a|b)(c|d)E+G?');
  const generator2 = new SimpleRegexGenerator('P(Q|R|S)T(UV|W|X)*Z+');
  const generator3 = new SimpleRegexGenerator('1(0|1)*2(3|4){5}36');
  var tableItem:generationExample;
  for(var i=0;i<40;i++){
    tableItem={
      pattern1: generator1.generateMultipleStrings(1)[0],// pattern1(),
      pattern2: generator2.generateMultipleStrings(1)[0],//pattern2(),
      pattern3: generator3.generateMultipleStrings(1)[0],//pattern3()
    } 
    table[i] = tableItem;
  }
  console.table(table)
}
Main()
