"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const kamiya = __importStar(require("kamiya-codec"));
let type1Verbs = 'かく およぐ はなす まつ しぬ とぶ よむ とる かう'.split(' ');
let type2Verbs = 'みる たべる'.split(' ');
let irregularVerbs = 'くる する'.split(' ');
let conj = [
    kamiya.Conjugation.Dictionary,
    kamiya.Conjugation.Negative,
    kamiya.Conjugation.Conjunctive,
    kamiya.Conjugation.Ta,
    kamiya.Conjugation.Conditional,
    kamiya.Conjugation.Imperative,
    kamiya.Conjugation.Volitional,
];
let engBase = 'write,swim,speak,wait,die,fly,read,take,buy,see,eat,come,do'.split(',');
let engConj = `X
(I) don't X
(I) X (polite)
(I) X'ed
if (I) X
X!
(I) will X`.split('\n');
let header = 'Dict,negative,polite,past,conditional,imperative,volitional'.split(',');
if (header.length !== conj.length) {
    throw new Error('header.length!==conj.length?');
}
let endings = ',ない,ます,,ば,,う'.split(',');
if (endings.length !== conj.length) {
    throw new Error('endings.length!==conj.length?');
}
const append = (left, right) => left + (left.endsWith(right) ? '' : right);
const verbToRow = (v, type2) => conj.map((c, i) => append(kamiya.conjugate(v, c, type2)[0], endings[i]));
let type1 = type1Verbs.map(v => verbToRow(v, false));
let type2 = type2Verbs.map(v => verbToRow(v, true));
let irreg = irregularVerbs.map(v => verbToRow(v, false));
function* enumerate(v, n = 0) {
    for (let x of v) {
        yield [n++, x];
    }
}
exports.enumerate = enumerate;
let table = type1.concat(type2).concat(irreg);
let allVerbs = type1Verbs.concat(type2Verbs).concat(irregularVerbs);
console.log('base\tconjugated\tEnglish');
for (let cidx = 1; cidx < conj.length; cidx++) {
    for (let [vi, v] of enumerate(allVerbs)) {
        console.log(`${v} (${header[cidx]})\t${table[vi][cidx]}\t${engConj[cidx].replace('X', engBase[vi])}`);
    }
    console.log('\n');
}
