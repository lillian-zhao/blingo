import { useMemo, useRef } from 'react'

const fontMap = {
  modern: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  hand: 'font-hand',
  // Custom fonts
  array: 'font-array',
  boxing: 'font-boxing',
  nunito: 'font-nunito',
  stardom: 'font-stardom',
  telma: 'font-telma',
  bespokeserif: 'font-bespokeserif',
}

// Map font keys to actual font family names for inline styles
const fontFamilyMap = {
  modern: 'Arial, sans-serif',
  serif: 'Georgia, serif',
  mono: 'Courier New, monospace',
  hand: 'Comic Sans MS, cursive',
  // Custom fonts
  array: 'Array, sans-serif',
  boxing: 'Boxing, sans-serif',
  nunito: 'Nunito, sans-serif',
  stardom: 'Stardom, sans-serif',
  telma: 'Telma, sans-serif',
  bespokeserif: 'BespokeSerif, serif',
}

const fontSizeMap = {
  small: 'text-sm',
  base: 'text-base',
  large: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
}

const borderStyleMap = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
}

const cornerStyleMap = {
  rounded: 'rounded-lg',
  square: 'rounded-none',
  'very-rounded': 'rounded-2xl',
}

function BingoBoard({ size, cells, onCellChange, styles, setStyles }) {
  const containerRef = useRef(null)

  // Calculate optimal font size based on longest text
  const calculateFontSize = useMemo(() => {
    const center = Math.floor(size / 2)
    const cellTexts = cells.map((cell, i) => {
      const row = Math.floor(i / size)
      const col = i % size
      if (row === center && col === center) return 'FREE'
      return cell || ''
    })

    // Find the longest text
    const longestText = cellTexts.reduce((longest, text) => 
      text.length > longest.length ? text : longest, ''
    )

    if (!longestText.trim()) {
      return null
    }

    // Estimate optimal font size based on text length and cell size
    // This is a fast approximation that doesn't require DOM measurement
    const textLength = longestText.length
    const avgCharsPerLine = 10 // Approximate characters that fit per line at base size
    const estimatedLines = Math.ceil(textLength / avgCharsPerLine)
    
    // Base calculation: start with a reasonable size and scale down based on content
    // More lenient thresholds - allows more text before shrinking
    let optimalSize = 24
    
    if (textLength <= 8) {
      optimalSize = 28
    } else if (textLength <= 15) {
      optimalSize = 24
    } else if (textLength <= 25) {
      optimalSize = 20
    } else if (textLength <= 40) {
      optimalSize = 16
    } else if (textLength <= 60) {
      optimalSize = 14
    } else if (textLength <= 80) {
      optimalSize = 12
    } else {
      optimalSize = 10
    }

    // Adjust for multi-line text (less aggressive)
    if (estimatedLines > 3) {
      optimalSize = Math.max(10, optimalSize - (estimatedLines - 3) * 1.5)
    }

    return optimalSize
  }, [cells, size])

  const toggleStampForCell = (index) => {
    if (styles.stampStyle === 'none') return
    
    // Toggle stamp for this cell (including center cell)
    const stampCells = styles.stampCells || []
    const hasStamp = stampCells.includes(index)
    
    if (hasStamp) {
      setStyles(prev => ({
        ...prev,
        stampCells: (prev.stampCells || []).filter(i => i !== index)
      }))
    } else {
      setStyles(prev => ({
        ...prev,
        stampCells: [...(prev.stampCells || []), index]
      }))
    }
  }

  const handleCellDoubleClick = (index, e) => {
    // Don't toggle stamp if double-clicking on textarea
    if (e.target.tagName === 'TEXTAREA' || e.target.closest('textarea')) return
    if (e.target.tagName === 'BUTTON') return
    
    toggleStampForCell(index)
  }

  // Simple seeded random function - same index always produces same values
  const seededRandom = (seed) => {
    let value = Math.sin(seed) * 10000
    return value - Math.floor(value)
  }

  const getStampElement = (index) => {
    if (styles.stampStyle === 'none') return null
    
    const stampCells = styles.stampCells || []
    if (!stampCells.includes(index)) return null
    
    const stamps = {
      star: '⭐',
      heart: '❤️',
      checkmark: '✓',
      circle: '●',
      xmark: '✗',
      diamond: '◆',
    }
    
    const isCustomImage = styles.stampStyle === 'image' && styles.stampImage
    const stamp = isCustomImage ? null : (stamps[styles.stampStyle] || null)
    
    if (!stamp && !isCustomImage) return null
    
    // Determine size and position based on stampSize
    const sizeConfig = {
      large: {
        position: 'inset-0',
        fontSize: '8rem',
        imgSize: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      medium: {
        position: 'bottom-2 right-2',
        fontSize: '2.25rem', // 50% bigger than 1.5rem
        imgSize: '3rem', // 50% bigger than 2rem
      },
      small: {
        position: 'bottom-2 right-2',
        fontSize: '1.5rem', // Same as old medium
        imgSize: '2rem', // Same as old medium
      },
    }
    
    const config = sizeConfig[styles.stampSize] || sizeConfig.medium
    const isLarge = styles.stampSize === 'large'
    
    // Calculate random rotation and offset if randomize is enabled
    let rotation = 0
    let offsetX = 0
    let offsetY = 0
    
    if (styles.stampRandomize) {
      // Use cell index as seed for consistent randomization per cell
      const seed1 = seededRandom(index * 100)
      const seed2 = seededRandom(index * 200)
      const seed3 = seededRandom(index * 300)
      
      rotation = seed1 * 360 // Random rotation 0-360 degrees
      
      // Random offset - limit to keep it noticeable but within bounds
      // Use different offsets for large vs corner stamps
      if (isLarge) {
        // For large stamps, smaller offset since they take up most of the cell
        offsetX = (seed2 - 0.5) * 8 // -4% to +4%
        offsetY = (seed3 - 0.5) * 8 // -4% to +4%
      } else {
        // For corner stamps, larger offset
        offsetX = (seed2 - 0.5) * 25 // -12.5% to +12.5%
        offsetY = (seed3 - 0.5) * 25 // -12.5% to +12.5%
      }
    }
    
    return (
      <span 
        className={`absolute flex items-center justify-center pointer-events-none z-10 ${isLarge ? '' : config.position}`}
        style={{ 
          fontSize: config.fontSize,
          lineHeight: '1',
          opacity: styles.stampOpacity !== undefined ? styles.stampOpacity : 0.4,
          transform: `rotate(${rotation}deg) translate(${offsetX}%, ${offsetY}%)`,
          transformOrigin: 'center center',
          ...(isLarge ? {
            width: '90%',
            height: '90%',
            left: '5%',
            top: '5%',
          } : {})
        }}
      >
        {isCustomImage ? (
          <img 
            src={styles.stampImage} 
            alt="Stamp" 
            className="object-contain"
            style={{
              width: isLarge ? '100%' : config.imgSize,
              height: isLarge ? '100%' : config.imgSize,
            }}
          />
        ) : (
          stamp
        )}
      </span>
    )
  }

  const getCellStyle = (index) => {
    const row = Math.floor(index / size)
    const col = index % size
    const center = Math.floor(size / 2)
    const isCenter = row === center && col === center
    
    return {
      backgroundColor: styles.backgroundColor 
        ? styles.backgroundColor 
        : styles.backgroundColor,
      color: styles.textColor,
      borderColor: styles.borderColor,
      borderWidth: `${styles.borderWidth}px`,
      fontFamily: fontFamilyMap[styles.fontFamily] || fontFamilyMap.modern,
      fontStyle: styles.fontStyle || 'normal',
      fontWeight: styles.fontWeight || 'normal',
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {styles.title && (
        <div 
          className="text-center mb-6 pt-8 pb-4 px-6 -mx-6 -mt-6"
          style={{ 
            backgroundColor: styles.titleBackgroundColor || 'transparent',
          }}
        >
          <h2 
            className={`font-bold ${fontMap[styles.fontFamily]} ${
              styles.titleSize === 'small' ? 'text-2xl' :
              styles.titleSize === 'medium' ? 'text-3xl' :
              styles.titleSize === 'large' ? 'text-4xl' :
              styles.titleSize === 'xlarge' ? 'text-5xl' :
              styles.titleSize === 'xxlarge' ? 'text-6xl' :
              'text-5xl'
            }`}
            style={{ 
              color: styles.titleColor || styles.textColor,
              fontFamily: fontFamilyMap[styles.fontFamily] || fontFamilyMap.modern,
              fontStyle: styles.fontStyle || 'normal',
              fontWeight: styles.fontWeight || 'bold',
            }}
          >
            {styles.title}
          </h2>
        </div>
      )}

      <div 
        ref={containerRef}
        className="grid gap-0 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: '800px',
        }}
      >
        {cells.map((cell, index) => {
          const row = Math.floor(index / size)
          const col = index % size
          const center = Math.floor(size / 2)
          const isCenter = row === center && col === center
          
          return (
            <div
              key={index}
              data-cell
              onDoubleClick={(e) => handleCellDoubleClick(index, e)}
              className={`
                relative flex items-center justify-center p-4 md:p-6
                aspect-square border
                ${borderStyleMap[styles.borderStyle]}
                ${cornerStyleMap[styles.cornerStyle]}
                ${fontMap[styles.fontFamily]}
                ${calculateFontSize ? '' : fontSizeMap[styles.fontSize]}
                ${isCenter ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''}
                ${styles.stampStyle !== 'none' ? 'cursor-pointer' : ''}
                transition-all duration-200 hover:shadow-md
              `}
              style={{
                ...getCellStyle(index),
                fontSize: calculateFontSize ? `${calculateFontSize}px` : undefined,
              }}
            >
              {/* Show stamp if this cell has one */}
              {getStampElement(index)}
              
              {isCenter ? (
                <div className="text-center font-bold w-full h-full flex items-center justify-center">
                  {styles.centerStyle === 'image' && styles.centerImage ? (
                    <img 
                      src={styles.centerImage} 
                      alt="Center" 
                      className="object-contain"
                      style={{ 
                        width: `${styles.centerImageSize || 80}%`,
                        height: `${styles.centerImageSize || 80}%`,
                      }}
                    />
                  ) : styles.centerStyle === 'star' ? (
                    <svg 
                      width={`${styles.centerSquareSize || 60}%`} 
                      height={`${styles.centerSquareSize || 60}%`} 
                      viewBox="0 0 24 24" 
                      fill={styles.textColor || '#1f2937'}
                      style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ) : styles.centerStyle === 'sparkle' ? (
                    <svg 
                      width={`${styles.centerSquareSize || 60}%`} 
                      height={`${styles.centerSquareSize || 60}%`} 
                      viewBox="0 0 24 24" 
                      fill={styles.textColor || '#1f2937'}
                      style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                      <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z"/>
                      <circle cx="6" cy="6" r="1" fill={styles.textColor || '#1f2937'}/>
                      <circle cx="18" cy="18" r="1" fill={styles.textColor || '#1f2937'}/>
                      <circle cx="18" cy="6" r="1" fill={styles.textColor || '#1f2937'}/>
                      <circle cx="6" cy="18" r="1" fill={styles.textColor || '#1f2937'}/>
                    </svg>
                  ) : styles.centerStyle === 'heart' ? (
                    <svg 
                      width={`${styles.centerSquareSize || 60}%`} 
                      height={`${styles.centerSquareSize || 60}%`} 
                      viewBox="0 0 24 24" 
                      fill={styles.textColor || '#1f2937'}
                      style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : styles.centerStyle === 'circle' ? (
                    <svg 
                      width={`${styles.centerSquareSize || 60}%`} 
                      height={`${styles.centerSquareSize || 60}%`} 
                      viewBox="0 0 24 24" 
                      fill={styles.textColor || '#1f2937'}
                      style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                      <circle cx="12" cy="12" r="10" stroke={styles.textColor || '#1f2937'} strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="6" fill={styles.textColor || '#1f2937'}/>
                    </svg>
                  ) : (
                    <div style={{ 
                      color: styles.textColor,
                      fontStyle: styles.fontStyle || 'normal',
                      fontWeight: styles.fontWeight || 'bold',
                      fontSize: calculateFontSize ? `${calculateFontSize}px` : undefined,
                    }}>FREE</div>
                  )}
                </div>
              ) : (
                <textarea
                  value={cell}
                  onChange={(e) => onCellChange(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Cell ${index + 1}`}
                  className="w-full h-full text-center bg-transparent border-none outline-none focus:outline-none resize-none overflow-hidden"
                  style={{ 
                    color: styles.textColor,
                    fontStyle: styles.fontStyle || 'normal',
                    fontWeight: styles.fontWeight || 'normal',
                    fontSize: calculateFontSize ? `${calculateFontSize}px` : undefined,
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                  }}
                  rows={1}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BingoBoard

