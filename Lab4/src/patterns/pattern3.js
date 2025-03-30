"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern3 = void 0;
var pattern3 = function () {
    var generated_string;
    var bin = (Math.random() < 0.5 ? "0" : "1").repeat(Math.ceil(Math.random() * 5) + 1);
    var rep34 = (Math.random() < 0.5 ? "3" : "4").repeat(5);
    generated_string = "1".concat(bin, "2").concat(rep34, "36");
    return generated_string;
};
exports.pattern3 = pattern3;
