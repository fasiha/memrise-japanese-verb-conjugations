import * as kamiya from 'kamiya-codec';

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
(I) will X/let’s X`.split('\n');
let header = 'Dict,negative,polite,past,conditional,imperative,volitional'.split(',');
if (header.length !== conj.length) { throw new Error('header.length!==conj.length?'); }

let endings = ',ない,ます,,ば,,う'.split(',');
if (endings.length !== conj.length) { throw new Error('endings.length!==conj.length?'); }
const append = (left: string, right: string) => left + (left.endsWith(right) ? '' : right);
const verbToRow = (v: string, type2: boolean) =>
    conj.map((c, i) => append(kamiya.conjugate(v, c, type2)[0], endings[i]));

let type1 = type1Verbs.map(v => verbToRow(v, false));
let type2 = type2Verbs.map(v => verbToRow(v, true));
let irreg = irregularVerbs.map(v => verbToRow(v, false));

export function* enumerate<T>(v: T[]|IterableIterator<T>, n: number = 0): IterableIterator<[number, T]> {
  for (let x of v) { yield [n++, x]; }
}

let table = type1.concat(type2).concat(irreg);
let allVerbs = type1Verbs.concat(type2Verbs).concat(irregularVerbs);
console.log('base\tconjugated\tEnglish');
for (let cidx = 1; cidx < conj.length; cidx++) {
  for (let [vi, v] of enumerate(allVerbs)) {
    console.log(`${v} (${header[cidx]})\t${table[vi][cidx]}\t${engConj[cidx].replace(/X/g, engBase[vi])}`);
  }
  console.log('\n')
}