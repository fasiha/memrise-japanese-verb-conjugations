#!/usr/bin/env bash

# This script assumes you've run something like `npm run run` to generate `course.tsv`, AND that
# you've installed and set up the AWS command-line interface for AWS Polly: see
# https://docs.aws.amazon.com/polly/latest/dg/getting-started-cli.html

mkdir -p Mizuki Takumi
cat course.tsv | grep -v "base kana\tconjugated kana" | sed '/^$/d' | while read line; do
  # echo $line
  kana=$(echo "$line" | cut -f2)
  kanji=$(echo "$line" | cut -f5)
  for voice in Mizuki Takumi; do
    if [ ! -f "$voice/$kana.mp3" ]; then
      aws polly synthesize-speech --output-format mp3 --voice-id $voice --text "$kanji" "$voice/$kana.mp3"
    fi
  done
done
