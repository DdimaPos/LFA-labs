"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern1 = void 0;
var pattern1 = function () {
    var generated_string;
    var a_b = Math.random() < 0.5 ? "a" : "b";
    var c_d = Math.random() < 0.5 ? "c" : "b";
    var n_of_repeats = Math.ceil(Math.random() * 5) + 1;
    var E = "E".repeat(n_of_repeats);
    generated_string = "".concat(a_b).concat(c_d).concat(E, "G");
    return generated_string;
};
exports.pattern1 = pattern1;
