# aldebrn’s Japanese Verb Conjugations Memrise course

If you just want to take the Memrise.com course to practice Japanese verb conjugations, just go here!: https://www.memrise.com/course/2172977/japanese-verb-conjugations/

This web page (actually, a source code repository) is only of interest to developers interested in how to generate the spreadsheet underlying the course. That spreadsheet is also included in this repo: see [course.tsv](./course.tsv); click "Raw" there to download the raw file instead of looking at it with GitHub’s fancy table viewer. You can open `course.tsv` in any spreadsheet program (Numbers, Excel, Calc, Google Sheets, etc., though, Excel users beware, it contains UTF-8 characters).

If you really want to run this code from scratch (it’s not hard!):
- install [Git](https://git-scm.com/)
- install [Node.js](https://nodejs.org/)
- in your command line (Terminal app in macOS, Command Prompt in Windows, xterm in Linux, etc.), run the following to clone (copy) this repository from GitHub to your computer, change into the newly-created directory, and install JavaScript dependencies and run the script:
```
git clone https://github.com/fasiha/memrise-japanese-verb-conjugations.git
cd memrise-japanese-verb-conjugations
npm install
npm run run
```

That last step will convert the TypeScript code to JavaScript and then run `node index.js` to update `course.tsv`.

Memrise.com course authoring lets you paste the tab-separated values (“TSV”) into each level, which is what I did.

I used the kanji columns to generate audio via [AWS Polly](https://aws.amazon.com/polly/) (which offers thousands of characters of text-to-speech for free, in many languages and two voices for Japanese, as of early 2019). Note, the Memrise.com course only uses kana for the lowest barrier to learning, but AWS Polly performs better with kanji text.

Finally, I used another program of mine, [memrise-driver](https://github.com/fasiha/memrise-driver/), to automatically upload the audio clips to Memrise.com. (That code repository also includes a handy script, [makeAudio.sh](https://github.com/fasiha/memrise-driver/blob/master/makeAudio.sh) for Unix shells (macOS or Linux), that wraps the AWS Polly calls.)

Reach out via [opening an issue on GitHub](https://github.com/fasiha/memrise-japanese-verb-conjugations/issues) *or* [contacting me directly](https://fasiha.github.io/#contact).