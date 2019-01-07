# aldebrn’s Japanese Verb Conjugations Memrise course

If you just want to take the Memrise.com course to practice Japanese verb conjugations, just go here!: https://www.memrise.com/course/2172977/japanese-verb-conjugations/

If you want to download the spreadsheet underlying the course: see [course.tsv](./course.tsv).

> This tab-separated values (TSV) file can be opened in any spreadsheet program (Numbers, Excel, Calc, Google Sheets, etc., though, Excel users beware, it contains UTF-8 characters).

This web page (actually, a source code repository) is only of interest to developers interested in how to generate the spreadsheet underlying the course. So, if you really want to run this code from scratch (it’s not hard!):
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

I used the kanji columns to generate audio via [AWS Polly](https://aws.amazon.com/polly/), which offers thousands of characters of text-to-speech for free, in many languages and two voices for Japanese, as of early 2019. A Bash script, [tsv2audio.sh](./tsv2audio.sh), automates converting the TSV file to MP3s in the two Japanese voices via AWS Polly.

> Assuming you have [set up](https://docs.aws.amazon.com/polly/latest/dg/getting-started-cli.html) AWS Polly, you can run this script natively in macOS and Linux; on Windows, you will need either the Git Bash shell, Cygwin, or possibly the Linux Bash Shell.

Note, the Memrise.com course only uses kana (for the lowest barrier to learning), but AWS Polly performs better with kanji text.

Finally, I used another program of mine, [memrise-driver](https://github.com/fasiha/memrise-driver/), to automatically upload the audio clips to Memrise.com.

Reach out via [opening an issue on GitHub](https://github.com/fasiha/memrise-japanese-verb-conjugations/issues) *or* [contacting me directly](https://fasiha.github.io/#contact).