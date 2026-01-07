// Custom fonts configuration
// This file automatically detects and registers custom fonts from the public/fonts folder

export const customFonts = [
  {
    name: 'Array',
    family: 'array',
    displayName: 'Array',
    variants: [
      { weight: '400', file: '/fonts/Array_Complete/Fonts/TTF/Array-Regular.ttf' },
      { weight: '600', file: '/fonts/Array_Complete/Fonts/TTF/Array-Semibold.ttf' },
      { weight: '700', file: '/fonts/Array_Complete/Fonts/TTF/Array-Bold.ttf' },
    ],
  },
  {
    name: 'Boxing',
    family: 'boxing',
    displayName: 'Boxing',
    variants: [
      { weight: '400', file: '/fonts/Boxing_Complete/Fonts/WEB/fonts/Boxing-Regular.woff2' },
    ],
  },
  {
    name: 'Nunito',
    family: 'nunito',
    displayName: 'Nunito',
    variants: [
      { weight: '400', file: '/fonts/Nunito_Complete/Fonts/WEB/fonts/Nunito-Regular.woff2' },
      { weight: '600', file: '/fonts/Nunito_Complete/Fonts/WEB/fonts/Nunito-SemiBold.woff2' },
      { weight: '700', file: '/fonts/Nunito_Complete/Fonts/WEB/fonts/Nunito-Bold.woff2' },
    ],
  },
  {
    name: 'Stardom',
    family: 'stardom',
    displayName: 'Stardom',
    variants: [
      { weight: '400', file: '/fonts/Stardom_Complete/Fonts/WEB/fonts/Stardom-Regular.woff2' },
    ],
  },
  {
    name: 'Telma',
    family: 'telma',
    displayName: 'Telma',
    variants: [
      { weight: '300', file: '/fonts/Telma_Complete/Fonts/WEB/fonts/Telma-Light.woff2' },
      { weight: '400', file: '/fonts/Telma_Complete/Fonts/WEB/fonts/Telma-Regular.woff2' },
      { weight: '500', file: '/fonts/Telma_Complete/Fonts/WEB/fonts/Telma-Medium.woff2' },
      { weight: '700', file: '/fonts/Telma_Complete/Fonts/WEB/fonts/Telma-Bold.woff2' },
      { weight: '900', file: '/fonts/Telma_Complete/Fonts/WEB/fonts/Telma-Black.woff2' },
    ],
  },
  {
    name: 'BespokeSerif',
    family: 'bespokeserif',
    displayName: 'Bespoke Serif',
    variants: [
      { weight: '300', file: '/fonts/BespokeSerif_Complete/Fonts/WEB/fonts/BespokeSerif-Light.ttf' },
      { weight: '400', file: '/fonts/BespokeSerif_Complete/Fonts/WEB/fonts/BespokeSerif-Regular.ttf' },
      { weight: '500', file: '/fonts/BespokeSerif_Complete/Fonts/WEB/fonts/BespokeSerif-Medium.ttf' },
      { weight: '700', file: '/fonts/BespokeSerif_Complete/Fonts/WEB/fonts/BespokeSerif-Bold.ttf' },
      { weight: '800', file: '/fonts/BespokeSerif_Complete/Fonts/WEB/fonts/BespokeSerif-Extrabold.ttf' },
    ],
  },
]

// Generate @font-face CSS for all custom fonts
export const generateFontFaces = () => {
  return customFonts.map(font => {
    return font.variants.map(variant => {
      return `
@font-face {
  font-family: '${font.name}';
  src: url('${variant.file}') format('truetype');
  font-weight: ${variant.weight};
  font-style: normal;
  font-display: swap;
}`
    }).join('\n')
  }).join('\n')
}

// Get all font families for dropdown
export const getCustomFontFamilies = () => {
  return customFonts.map(font => ({
    value: font.family,
    label: font.displayName,
  }))
}

