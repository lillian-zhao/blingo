# Custom Fonts

Place your font files (TTF or OTF) in this folder.

## How to add a font:

1. Copy your font files (`.ttf` or `.otf`) into this folder (or subfolders)
2. Open `src/utils/fontLoader.js` and add your font configuration
3. Open `src/fonts.css` and add `@font-face` rules for your font
4. Update `tailwind.config.js` to include your font in the fontFamily configuration
5. Update `src/components/BingoBoard.jsx` to add the font mapping

## Example:

If you have a font file called `MyCustomFont.otf`:

**In `src/fonts.css`:**
```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont.otf') format('opentype');
  /* or for TTF: format('truetype') */
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**In `tailwind.config.js` (in the fontFamily section):**
```js
'mycustom': ['MyCustomFont', 'sans-serif'],
```

**In `src/utils/fontLoader.js`:**
```js
{
  name: 'MyCustomFont',
  family: 'mycustom',
  displayName: 'My Custom Font',
  variants: [
    { weight: '400', file: '/fonts/MyCustomFont.otf' },
  ],
},
```

**Then you can use it in the app** by selecting it from the font family dropdown or in themes.

