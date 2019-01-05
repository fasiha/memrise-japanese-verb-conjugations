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
let kanji = `書く 泳ぐ 話す 待つ 死ぬ 飛ぶ 読む 取る 買う 見る 食べる 来る する`.split(' ');
let kana = `かく およぐ はなす まつ しぬ とぶ よむ とる かう みる たべる くる する`.split(' ');
if (kana.length !== kanji.length) {
    throw new Error('bad lengths');
}
let conj = [
    kamiya.Conjugation.Dictionary,
    kamiya.Conjugation.Negative,
    kamiya.Conjugation.Conjunctive,
    kamiya.Conjugation.Ta,
    kamiya.Conjugation.Conditional,
    kamiya.Conjugation.Imperative,
    kamiya.Conjugation.Volitional,
];
let endings = ',ない,ます,,ば,,う'.split(',');
if (endings.length !== conj.length) {
    throw new Error('endings.length!==conj.length?');
}
const append = (left, right) => left + (left.endsWith(right) ? '' : right);
const verbToRow = (v, type2) => conj.map((c, i) => append(kamiya.conjugate(v, c, type2)[0], endings[i]));
let [type1kanji, type1kana] = [kanji, kana].map(vs => vs.slice(0, 8).map(v => verbToRow(v, false)));
let [type2kanji, type2kana] = [kanji, kana].map(vs => vs.slice(8, 10).map(v => verbToRow(v, true)));
let [irregkanji, irregkana] = [kanji, kana].map(vs => vs.slice(10).map(v => verbToRow(v, false)));
let tableKanji = type1kanji.concat(type2kanji).concat(irregkanji);
let tableKana = type1kana.concat(type2kana).concat(irregkana);
let engBase = 'write,swim,speak,wait,die,fly,read,take,buy,see,eat,come,do'.split(',');
let engConj = `X
(I) don’t X
(I) X (polite)
(I) X’ed
if (I) X
X!
(I) will X/let’s X`.split('\n');
let conjNames = 'Dict,negative,polite,past,conditional,imperative,volitional'.split(',');
if (conjNames.length !== conj.length) {
    throw new Error('header.length!==conj.length?');
}
function* enumerate(v, n = 0) {
    for (let x of v) {
        yield [n++, x];
    }
}
exports.enumerate = enumerate;
console.log('base\tbase kana\tconjugated\tconjugated kana\tEnglish');
for (let cidx = 1; cidx < conj.length; cidx++) {
    for (let [vi, v] of enumerate(kanji)) {
        let conj = tableKanji[vi][cidx];
        let conjKana = tableKana[vi][cidx];
        let eng = engConj[cidx].replace(/X/g, engBase[vi]);
        let base = `${v} (${conjNames[cidx]})`;
        let baseKana = `${kana[vi]} (${conjNames[cidx]})`;
        console.log([base, baseKana, conj, conjKana, eng].join('\t'));
    }
    console.log('\n');
}
