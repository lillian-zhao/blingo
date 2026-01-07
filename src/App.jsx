import { useState } from 'react'
import BingoBoard from './components/BingoBoard'
import StylePanel from './components/StylePanel'
import { useExport } from './hooks/useExport'

// Helper function to generate board background pattern
const getBoardPatternStyle = (pattern, baseColor, patternColor) => {
  if (!pattern || pattern === 'none') return {}
  
  const bgColor = baseColor || '#ffffff'
  const patColor = patternColor || '#e5e7eb'
  
  switch (pattern) {
    case 'grid':
      return {
        backgroundImage: `
          linear-gradient(${patColor} 1px, transparent 1px),
          linear-gradient(90deg, ${patColor} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundColor: bgColor,
      }
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, ${patColor} 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
        backgroundColor: bgColor,
      }
    case 'diagonal-lines':
      return {
        backgroundImage: `repeating-linear-gradient(
          45deg,
          ${bgColor},
          ${bgColor} 10px,
          ${patColor} 10px,
          ${patColor} 20px
        )`,
      }
    case 'gradient':
      // For gradient, we need two colors
      const gradientColor2 = patternColor || '#cbd5e0'
      return {
        background: `linear-gradient(135deg, ${bgColor} 0%, ${gradientColor2} 100%)`,
      }
    case 'stripes':
      return {
        backgroundImage: `repeating-linear-gradient(
          90deg,
          ${bgColor},
          ${bgColor} 20px,
          ${patColor} 20px,
          ${patColor} 40px
        )`,
      }
    case 'checkerboard':
      return {
        backgroundImage: `
          linear-gradient(45deg, ${patColor} 25%, transparent 25%),
          linear-gradient(-45deg, ${patColor} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${patColor} 75%),
          linear-gradient(-45deg, transparent 75%, ${patColor} 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        backgroundColor: bgColor,
      }
    default:
      return {}
  }
}

function App() {
  const [boardSize, setBoardSize] = useState(5)
  const [cells, setCells] = useState(() => {
    const size = 5
    const center = Math.floor(size / 2)
    const initialCells = Array(size * size).fill('').map((_, i) => {
      const row = Math.floor(i / size)
      const col = i % size
      if (row === center && col === center) {
        return 'FREE'
      }
      return ''
    })
    return initialCells
  })
  
  const [styles, setStyles] = useState({
    fontFamily: 'modern',
    fontSize: 'base',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textColor: '#1f2937',
    titleColor: '#1f2937',
    backgroundColor: '#ffffff',
    boardBackgroundColor: '#ffffff',
    boardPattern: 'none',
    boardPatternColor: '#e5e7eb',
    boardPatternColor2: '#cbd5e0',
    titleBackgroundColor: 'transparent',
    borderColor: '#e5e7eb',
    borderWidth: '2',
    borderStyle: 'solid',
    cornerStyle: 'rounded',
    stampStyle: 'none',
    stampImage: null,
    stampSize: 'medium',
    stampOpacity: 0.4,
    stampRandomize: false,
    stampCells: [], // Array of cell indices that have stamps
    centerStyle: 'text',
    centerImage: null,
    title: 'BINGO',
    titleSize: 'large',
  })

  const { exportToPDF, exportToPNG, boardRef } = useExport()

  const handleCellChange = (index, value) => {
    const row = Math.floor(index / boardSize)
    const col = index % boardSize
    const center = Math.floor(boardSize / 2)
    
    // Prevent editing the center cell if it's the "FREE" cell
    if (row === center && col === center && value.trim() === '') {
      return
    }
    
    const newCells = [...cells]
    newCells[index] = value
    setCells(newCells)
  }

  const handleSizeChange = (newSize) => {
    setBoardSize(newSize)
    const center = Math.floor(newSize / 2)
    const newCells = Array(newSize * newSize).fill('').map((_, i) => {
      const row = Math.floor(i / newSize)
      const col = i % newSize
      if (row === center && col === center) {
        return 'FREE'
      }
      return ''
    })
    setCells(newCells)
  }

  const randomizeBoard = () => {
    const newCells = [...cells]
    const center = Math.floor(boardSize / 2)

    // Collect indices + values for all non-center cells
    const indices = []
    const values = []

    for (let i = 0; i < newCells.length; i++) {
      const row = Math.floor(i / boardSize)
      const col = i % boardSize
      const isCenter = row === center && col === center
      if (isCenter) continue
      indices.push(i)
      values.push(newCells[i] || '')
    }

    // Shuffle values (Fisher–Yates)
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[values[i], values[j]] = [values[j], values[i]]
    }

    // Put shuffled values back into the same positions
    indices.forEach((idx, i) => {
      newCells[idx] = values[i]
    })

    setCells(newCells)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Array, sans-serif' }}>
            blingo
          </h1>
          <p className="text-gray-400 text-base" style={{ fontFamily: 'Georgia, serif' }}>create beautiful, customizable bingo boards!</p>
        </header>

        <div className="border-t border-gray-300 mb-0"></div>

        <div className="bg-white -mx-4 px-4 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StylePanel
              styles={styles}
              setStyles={setStyles}
              boardSize={boardSize}
              onSizeChange={handleSizeChange}
              onRandomize={randomizeBoard}
              onExportPDF={exportToPDF}
              onExportPNG={exportToPNG}
            />
          </div>

          <div className="lg:col-span-2">
            <div 
              ref={boardRef}
              className="shadow-xl p-6"
              style={{ 
                backgroundColor: styles.boardBackgroundColor || '#ffffff',
                ...getBoardPatternStyle(
                  styles.boardPattern,
                  styles.boardBackgroundColor || '#ffffff',
                  styles.boardPattern === 'gradient' ? styles.boardPatternColor2 : styles.boardPatternColor
                ),
              }}
            >
                  <BingoBoard
                    size={boardSize}
                    cells={cells}
                    onCellChange={handleCellChange}
                    styles={styles}
                    setStyles={setStyles}
                  />
            </div>
          </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300"></div>
        
        <footer className="text-left py-8">
          <p className="text-white text-6xl" style={{ fontFamily: 'Array, sans-serif' }}>
            footer.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

