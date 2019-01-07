import * as kamiya from 'kamiya-codec';
function* enumerate<T>(v: T[]|IterableIterator<T>, n: number = 0): IterableIterator<[number, T]> {
  for (let x of v) { yield [n++, x]; }
}
function* zip(...arrs: any[][]) {
  const stop = Math.min(...arrs.map(v => v.length));
  for (let i = 0; i < stop; i++) { yield arrs.map(v => v[i]); }
}

function basics() {
  let kanji = `書く 泳ぐ 話す 待つ 死ぬ 飛ぶ 読む 取る 買う 見る 食べる 来る する`.split(' ');
  let kana = `かく およぐ はなす まつ しぬ とぶ よむ とる かう みる たべる くる する`.split(' ');
  if (kana.length !== kanji.length) { throw new Error('bad lengths: kana/kanji'); }

  let conj = [
    kamiya.Conjugation.Dictionary,
    kamiya.Conjugation.Negative,
    kamiya.Conjugation.Conjunctive,
    kamiya.Conjugation.Ta,
    kamiya.Conjugation.Conditional,
    kamiya.Conjugation.Imperative,
    kamiya.Conjugation.Volitional,
    kamiya.Conjugation.Te,
    kamiya.Conjugation.Tara,
    kamiya.Conjugation.Tari,
  ];

  let endings = ',ない,ます,,ば,,う,,,'.split(',');
  if (endings.length !== conj.length) { throw new Error('bad length: endings'); }
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
as long as (I) X, …
X!
(I) will X/let’s X
(I) X and …
if/when (I) X, then …
(I) sometimes X and sometimes …`.split('\n');
  let conjNames = 'Dict,negative,polite,past,conditional,imperative,volitional,te,tara,tari'.split(',');
  if (conjNames.length !== conj.length) { throw new Error('bad length: conjNames'); }
  if (engConj.length !== conj.length) { throw new Error('bad length: engConj'); }

  console.log('base kana, conjugated kana, English, base, conjugated'.split(', ').join('\t'));
  for (let cidx = 1; cidx < conj.length; cidx++) {
    for (let [vi, v] of enumerate(kanji)) {
      let conj = tableKanji[vi][cidx];
      let conjKana = tableKana[vi][cidx];
      let eng = engConj[cidx].replace(/X/g, engBase[vi]);
      let base = `${v}＋${conjNames[cidx]}`;
      let baseKana = `${kana[vi]}＋${conjNames[cidx]}`;
      console.log([baseKana, conjKana, eng, base, conj].join('\t'));
    }
    console.log('\n')
  }
}
basics();

function makeTable(kana: string, kanji: string, aux: kamiya.Auxiliary, typeII: boolean,
                   conjs: [kamiya.Conjugation, string, string, string?][]) {
  let printableKanji = '';
  let printableKana = '';
  console.log('base kana, conjugated kana, English, base, conjugated'.split(', ').join('\t'));
  for (let [conj, conjName, eng, extra] of conjs) {
    extra = extra || '';
    let [conjKana, conjKanji] = [kana, kanji].map(v => kamiya.conjugateAuxiliary(v, aux, conj, typeII)[0]);
    let wrap = (k: string) => `${k}＋${conjName}`;
    if (conj === kamiya.Conjugation.Dictionary) {
      [printableKanji, printableKana] = [conjKanji, conjKana];
      console.log([wrap(kana), conjKana + extra, eng, wrap(kanji), conjKanji + extra].join('\t'));
    } else {
      if (printableKana === '') { throw new Error('Did not get a printable/dictionary conjugation first'); }
      console.log([wrap(printableKana), conjKana + extra, eng, wrap(printableKanji), conjKanji + extra].join('\t'));
    }
  }
  console.log('\n');
}

function masu() {
  let kana = 'いく';
  let kanji = '行く';
  let conjs: [kamiya.Conjugation, string, string][] = [
    [kamiya.Conjugation.Dictionary, 'masu', 'I go (polite)'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t/didn’t go'],
    [kamiya.Conjugation.Ta, 'past', '(I) went'],
    [kamiya.Conjugation.Volitional, 'volitional', '(I) will go, let’s go'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.Masu, false, conjs);
}
masu();

function nai() {
  let kana = 'かう';
  let kanji = '買う';
  let conjs: [kamiya.Conjugation, string, string][] = [
    [kamiya.Conjugation.Dictionary, 'nai', '(I) don’t buy'],
    [kamiya.Conjugation.Negative, '    negative', '    it isn’t that (I) don’t buy'],
    [kamiya.Conjugation.Ta, '    past', '    (I) didn’t buy'],
    [kamiya.Conjugation.Conditional, '    conditional', '    as long as (I) don’t buy, …'],
    [kamiya.Conjugation.Te, '    te', '    (I’m) not buying and so …; because (I’m) not buying, …'],
    [kamiya.Conjugation.Tara, '    tara', '    if/when (I) don’t buy, then …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.Nai, false, conjs);
}
nai();

function tai() {
  let kana = 'たべる';
  let kanji = '食べる';
  let conjs: [kamiya.Conjugation, string, string][] = [
    [kamiya.Conjugation.Dictionary, 'tai', '(I) want to eat'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t want to eat'],
    [kamiya.Conjugation.Ta, 'past', '(I) wanted to eat'],
    [kamiya.Conjugation.Conditional, 'conditional', 'as long as (I) want to eat, …'],
    [kamiya.Conjugation.Te, 'te', '(I) want to eat and thus …; because (I) want to eat, …'],
    [kamiya.Conjugation.Tara, 'tara', 'if (I) want to eat, then …'],

  ];
  makeTable(kana, kanji, kamiya.Auxiliary.Tai, true, conjs);
}
tai();

function tagaru() {
  let kana = 'あそぶ';
  let kanji = '遊ぶ';
  let conjs: [kamiya.Conjugation, string, string,string?][] = [
    [kamiya.Conjugation.Dictionary, 'tagaru', '(They) want to play'],
    [kamiya.Conjugation.Negative, 'negative', '(They) don’t want to play', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(They) wish to play (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(They) wanted to play'],
    [kamiya.Conjugation.Te, 'te', '(They) want to play and thus …; because (they) want to play, …'],
    [kamiya.Conjugation.Tara, 'tara', 'if (they) want to play, then …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.Tagaru, false, conjs);
}
tagaru();

function hoshii() {
  let kana = 'みる';
  let kanji = '見る';
  let conjs: [kamiya.Conjugation, string, string][] = [
    [kamiya.Conjugation.Dictionary, 'hoshii', '(I) want (them) to see'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t want (them) to see'],
    [kamiya.Conjugation.Ta, 'past', '(I) wanted (them) to see'],
    [kamiya.Conjugation.Conditional, 'conditional', 'as long as (I) want (them) to see, …'],
    [kamiya.Conjugation.Te, 'te', '(I) want (them) to see and thus …; because (I) want (them) to see, …'],
    [kamiya.Conjugation.Tara, 'tara', 'if (I) want (them) to see, then …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.Hoshii, true, conjs);
}
hoshii();

function seru() {
  let kana = 'よむ';
  let kanji = '読む';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'seru', '(I) make/let (them) read'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t make/let (them) read', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(I) make/let (them) read (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(I) made/let (them) read'],
    [kamiya.Conjugation.Conditional, 'conditional', 'as long as (I) made/let (them) read, …', 'ば'],
    [kamiya.Conjugation.Imperative, 'imperative', 'Make/let (them) read!'],
    [kamiya.Conjugation.Volitional, 'volitional', '(I) will make/let (them) read'],
    [kamiya.Conjugation.Te, 'te', '(I) make (them) read and thus …; because (I) make (them) read, …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.SeruSaseru, false, conjs);
}
seru();

function shortCausative() {
  let kana = 'よむ';
  let kanji = '読む';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'seru (short)', '(I) make/let (them) read'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t make/let (them) read', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(I) make/let (them) read (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(I) made/let (them) read'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.ShortenedCausative, false, conjs);
}
shortCausative();

function saseru() {
  let kana = 'たべる';
  let kanji = '食べる';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'saseru', '(I) make/let (them) eat'],
    [kamiya.Conjugation.Negative, 'negative', '(I) don’t make/let (them) eat', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(I) make/let (them) eat (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(I) made/let (them) eat'],
    [kamiya.Conjugation.Conditional, 'conditional', 'as long as (I) made/let (them) eat, …', 'ば'],
    [kamiya.Conjugation.Imperative, 'imperative', 'Make/let (them) eat!'],
    [kamiya.Conjugation.Volitional, 'volitional', '(I) will make/let (them) eat'],
    [kamiya.Conjugation.Te, 'te', '(I) make (them) eat and thus …; because (I) make (them) eat, …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.SeruSaseru, true, conjs);
}
saseru();

function reru() {
  let kana = 'かく';
  let kanji = '書く';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'reru', '(it) is written; (I) can or am able to write'],
    [kamiya.Conjugation.Negative, 'negative', '(it) isn’t written; (I) cannot or am unable to write', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(it) is written (polite); (I) am able to write (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(it) was written; (I) was able to write'],
    [kamiya.Conjugation.Te, 'te', '(it) is written and thus …; (I) am able to write and thus …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.ReruRareu, false, conjs);
}
reru();

function rareru() {
  let kana = 'みる';
  let kanji = '見る';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'rareru', '(it) is seen; (I) can, or am able to, see'],
    [kamiya.Conjugation.Negative, 'negative', '(it) isn’t seen; (I) cannot, or am not able to, see', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(it) is seen (polite); (I) can, or am able to, see (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(it) was seen; (I) was able to see'],
    [kamiya.Conjugation.Te, 'te', '(it) is seen and thus …; (I) am able to see and thus …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.ReruRareu, true, conjs);
}
rareru();

function passiveCausative() {
  let kana = 'かく';
  let kanji = '書く';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'seru+reru', '(I) am made to write'],
    [kamiya.Conjugation.Negative, 'negative', '(I) am not made to write', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(I) am made to write (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(I) was made to write'],
    [kamiya.Conjugation.Te, 'te', '(I) am made to write and thus …; because (I) am made to write, …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.CausativePassive, false, conjs);
}
passiveCausative();

function shortPassiveCausative() {
  let kana = 'かく';
  let kanji = '書く';
  let conjs: [kamiya.Conjugation, string, string, string?][] = [
    [kamiya.Conjugation.Dictionary, 'seru+reru (short)', '(I) am made to write'],
    [kamiya.Conjugation.Negative, 'negative', '(I) am not made to write', 'ない'],
    [kamiya.Conjugation.Conjunctive, 'polite', '(I) am made to write (polite)', 'ます'],
    [kamiya.Conjugation.Ta, 'past', '(I) was made to write'],
    [kamiya.Conjugation.Te, 'te', '(I) am made to write and thus …; because (I) am made to write, …'],
  ];
  makeTable(kana, kanji, kamiya.Auxiliary.ShortenedCausativePassive, false, conjs);
}
shortPassiveCausative();
