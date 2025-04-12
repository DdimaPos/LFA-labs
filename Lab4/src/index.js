"use strict";
//Variant 1:
//(a|b)(c|d)E+G?
//P(Q|R|S)T(UV|W|X)*Z+
//1(0|1)*2(3|4)^5 36
Object.defineProperty(exports, "__esModule", { value: true });
var pattern1_1 = require("./patterns/pattern1");
var pattern2_1 = require("./patterns/pattern2");
var pattern3_1 = require("./patterns/pattern3");
function Main() {
    var table = new Array(40);
    var tableItem;
    for (var i = 0; i < 40; i++) {
        tableItem = {
            pattern1: (0, pattern1_1.pattern1)(),
            pattern2: (0, pattern2_1.pattern2)(),
            pattern3: (0, pattern3_1.pattern3)()
        };
        table[i] = tableItem;
    }
    console.table(table);
}
//Main();
var SimpleRegexGenerator = /** @class */ (function () {
    function SimpleRegexGenerator(pattern) {
        this.pattern = pattern;
        this.explanation = [];
    }
    SimpleRegexGenerator.prototype.addExplanation = function (part, explanation) {
        this.explanation.push("Processing '".concat(part, "': ").concat(explanation));
    };
    SimpleRegexGenerator.prototype.parsePattern = function () {
        var parts = [];
        var i = 0;
        var _loop_1 = function () {
            if (this_1.pattern[i] === '(') {
                var end = this_1.pattern.indexOf(')', i);
                if (end === -1)
                    throw new Error("Unmatched parenthesis");
                var group = this_1.pattern.slice(i + 1, end).split('|');
                parts.push(group);
                this_1.addExplanation(this_1.pattern.slice(i, end + 1), "Either of ".concat(group.join(" or "), " appears exactly once"));
                i = end + 1;
            }
            else if (this_1.pattern[i] === '{') {
                var end = this_1.pattern.indexOf('}', i);
                if (end === -1)
                    throw new Error("Unmatched curly brace");
                var repeat_1 = parseInt(this_1.pattern.slice(i + 1, end));
                if (parts.length > 0) {
                    var lastPart = parts.pop();
                    parts.push(lastPart.map(function (c) { return c.repeat(repeat_1); }));
                }
                this_1.addExplanation(this_1.pattern.slice(i, end + 1), "Previous character appears exactly ".concat(repeat_1, " times"));
                i = end + 1;
            }
            else if (i + 1 < this_1.pattern.length && this_1.pattern[i + 1] === '*') {
                var repeatCount = Math.floor(Math.random() * 6);
                parts.push([this_1.pattern[i].repeat(repeatCount)]);
                this_1.addExplanation(this_1.pattern.slice(i, i + 2), "'".concat(this_1.pattern[i], "' appears zero or more times"));
                i += 2;
            }
            else if (i + 1 < this_1.pattern.length && ['?', '+'].includes(this_1.pattern[i + 1])) {
                if (this_1.pattern[i + 1] === '?') {
                    parts.push([this_1.pattern[i], '']);
                    this_1.addExplanation(this_1.pattern.slice(i, i + 2), "'".concat(this_1.pattern[i], "' is optional"));
                }
                else if (this_1.pattern[i + 1] === '+') {
                    var repeatCount = Math.floor(Math.random() * 5) + 1;
                    parts.push([this_1.pattern[i].repeat(repeatCount)]);
                    this_1.addExplanation(this_1.pattern.slice(i, i + 2), "'".concat(this_1.pattern[i], "' appears one or more times"));
                }
                i += 2;
            }
            else {
                parts.push([this_1.pattern[i]]);
                this_1.addExplanation(this_1.pattern[i], "'".concat(this_1.pattern[i], "' appears exactly once"));
                i += 1;
            }
        };
        var this_1 = this;
        while (i < this.pattern.length) {
            _loop_1();
        }
        return parts;
    };
    SimpleRegexGenerator.prototype.explainProcess = function () {
        console.log("\nExplanation for Processing of Pattern ".concat(this.pattern, ":"));
        this.explanation.forEach(function (step) { return console.log(step); });
        console.log("\n");
    };
    SimpleRegexGenerator.prototype.generateRandomString = function (parts) {
        var resultString = parts.map(function (group) { return group[Math.floor(Math.random() * group.length)]; }).join('');
        resultString = resultString.replace(/\*/g, '');
        return resultString;
    };
    SimpleRegexGenerator.prototype.generateMultipleStrings = function (count) {
        var _this = this;
        var parts = this.parsePattern();
        return Array.from({ length: count }, function () { return _this.generateRandomString(parts); });
    };
    return SimpleRegexGenerator;
}());
var pattern = '1(0|1)*2(3|4){5}36';
var generator = new SimpleRegexGenerator(pattern);
console.log("hello");
var generatedStrings = generator.generateMultipleStrings(5);
console.table(generatedStrings);
