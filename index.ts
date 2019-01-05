import * as kamiya from 'kamiya-codec';
let kanji = `書く 泳ぐ 話す 待つ 死ぬ 飛ぶ 読む 取る 買う 見る 食べる 来る する`.split(' ');
let kana = `かく およぐ はなす まつ しぬ とぶ よむ とる かう みる たべる くる する`.split(' ');
if (kana.length !== kanji.length) { throw new Error('bad lengths'); }

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
if (endings.length !== conj.length) { throw new Error('endings.length!==conj.length?'); }
const append = (left: string, right: string) => left + (left.endsWith(right) ? '' : right);
const verbToRow = (v: string, type2: boolean) =>
    conj.map((c, i) => append(kamiya.conjugate(v, c, type2)[0], endings[i]));

let [type1kanji, type1kana] = [kanji, kana].map(vs => vs.slice(0, 9).map(v => verbToRow(v, false)));
let [type2kanji, type2kana] = [kanji, kana].map(vs => vs.slice(9, 11).map(v => verbToRow(v, true)));
let [irregkanji, irregkana] = [kanji, kana].map(vs => vs.slice(11).map(v => verbToRow(v, false)));
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
if (conjNames.length !== conj.length) { throw new Error('header.length!==conj.length?'); }

export function* enumerate<T>(v: T[]|IterableIterator<T>, n: number = 0): IterableIterator<[number, T]> {
  for (let x of v) { yield [n++, x]; }
}

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
  console.log('\n')
}