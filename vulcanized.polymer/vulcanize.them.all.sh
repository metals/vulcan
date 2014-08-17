#!/bin/sh

COREFILES="$(find ./core-* -name '*.html')"
for htmlfile in $COREFILES
do
    echo "core--> $htmlfile"
    vulcanize -o $htmlfile $htmlfile --csp
done


PAPERFILES="$(find ./paper-* -name '*.html')"
for htmlfile in $PAPERFILES
do
    echo "paper--> $htmlfile"
    vulcanize -o $htmlfile $htmlfile --csp
done


MARKEDFILES="$(find ./marked-element -name '*.html')"
for htmlfile in $MARKEDFILES
do
    echo "marked--> $htmlfile"
    vulcanize -o $htmlfile $htmlfile --csp
done

PRETTIFYFILES="$(find ./prettify-element -name '*.html')"
for htmlfile in $PRETTIFYFILES
do
    echo "prettify--> $htmlfile"
    vulcanize -o $htmlfile $htmlfile --csp
done

SAMPLERFILES="$(find ./sampler-scaffold -name '*.html')"
for htmlfile in $SAMPLERFILES
do
    echo "sampler-scaffold--> $htmlfile"
    vulcanize -o $htmlfile $htmlfile --csp
done