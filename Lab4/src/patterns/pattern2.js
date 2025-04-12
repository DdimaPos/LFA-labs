"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern2 = void 0;
var pattern2 = function () {
    var generated_string;
    var QRS = ["Q", "R", "S"][Math.floor(Math.random() * 3)];
    var UVWX = (Math.random() < 0.33 ? "UV" : Math.random() < 0.66 ? "W" : "X").repeat(Math.floor(Math.random() * 6));
    var Z = "Z".repeat(Math.floor(Math.random() * 5) + 1);
    generated_string = "P".concat(QRS, "T").concat(UVWX).concat(Z);
    return generated_string;
};
exports.pattern2 = pattern2;
