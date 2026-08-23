# assets

`ArchivoBlack-subset.ttf` is the face drawn into the Open Graph card
(`src/app/opengraph-image.tsx`). It is the same display face the site uses for
its headings, cut down to the characters the card actually shows.

Any character missing from it silently falls back to a different face, so when
the card's copy changes, rebuild the subset:

```sh
curl -sL -o "/tmp/ArchivoBlack-Regular.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf"

pyftsubset /tmp/ArchivoBlack-Regular.ttf \
  --text="react-comic-viewer A comic and manga viewer component for React. kkweb.io" \
  --unicodes="U+0020-007E,U+00A0-00FF" \
  --output-file=assets/ArchivoBlack-subset.ttf \
  --no-hinting --desubroutinize --layout-features=''
```
