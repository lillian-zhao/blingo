import { useState } from 'react'
import { themes } from '../utils/themes'
import { getCustomFontFamilies } from '../utils/fontLoader'

function StylePanel({
  styles,
  setStyles,
  boardSize,
  onSizeChange,
  onRandomize,
  onExportPDF,
  onExportPNG,
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [openSections, setOpenSections] = useState({
    Themes: false,
    Board: true,
    Title: false,
    Cells: false,
    Stamps: false,
  })

  const updateStyle = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }))
  }

  const applyTheme = (themeName) => {
    const theme = themes[themeName]
    if (theme) {
      const themeStyles = { ...theme }
      // Ensure boardBackgroundColor is always white (never transparent)
      if (!themeStyles.boardBackgroundColor || themeStyles.boardBackgroundColor === 'transparent') {
        themeStyles.boardBackgroundColor = '#ffffff'
      }
      setStyles(themeStyles)
    }
  }

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="bg-white shadow-xl p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Customize</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Accordion */}
          <div className="space-y-3">
            {/* Themes */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('Themes')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openSections.Themes}
              >
                <span className="font-semibold text-gray-800">Themes</span>
                <span className="text-gray-500">{openSections.Themes ? '−' : '+'}</span>
              </button>
              {openSections.Themes && (
                <div className="p-4 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Preset Themes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(themes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => applyTheme(key)}
                        className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors text-left"
                        title={theme.description}
                      >
                        <div className="font-medium text-gray-800">{theme.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{theme.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Board */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('Board')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openSections.Board}
              >
                <span className="font-semibold text-gray-800">Board</span>
                <span className="text-gray-500">{openSections.Board ? '−' : '+'}</span>
              </button>
              {openSections.Board && (
                <div className="p-4 space-y-4">
                  {/* Board Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Size
                    </label>
                    <select
                      value={boardSize}
                      onChange={(e) => onSizeChange(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={3}>3x3</option>
                      <option value={4}>4x4</option>
                      <option value={5}>5x5</option>
                      <option value={6}>6x6</option>
                    </select>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font
                    </label>
                    <select
                      value={styles.fontFamily}
                      onChange={(e) => updateStyle('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <optgroup label="Standard Fonts">
                        <option value="modern">Modern (Sans-serif)</option>
                        <option value="serif">Serif</option>
                        <option value="mono">Monospace</option>
                        <option value="hand">Handwriting</option>
                      </optgroup>
                      <optgroup label="Custom Fonts">
                        {getCustomFontFamilies().map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Board Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.boardBackgroundColor}
                        onChange={(e) => updateStyle('boardBackgroundColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.boardBackgroundColor}
                        onChange={(e) => updateStyle('boardBackgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Board Pattern */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Background Pattern
                    </label>
                    <select
                      value={styles.boardPattern || 'none'}
                      onChange={(e) => updateStyle('boardPattern', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    >
                      <option value="none">None</option>
                      <option value="grid">Grid Lines</option>
                      <option value="dots">Dots</option>
                      <option value="diagonal-lines">Diagonal Lines</option>
                      <option value="stripes">Stripes</option>
                      <option value="checkerboard">Checkerboard</option>
                      <option value="gradient">Gradient</option>
                    </select>
                    {styles.boardPattern && styles.boardPattern !== 'none' && (
                      <div className="space-y-2 mt-2">
                        {styles.boardPattern === 'gradient' ? (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Gradient Color 1 (Start)
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={styles.boardBackgroundColor || '#ffffff'}
                                  onChange={(e) => updateStyle('boardBackgroundColor', e.target.value)}
                                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={styles.boardBackgroundColor || '#ffffff'}
                                  onChange={(e) => updateStyle('boardBackgroundColor', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Gradient Color 2 (End)
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={styles.boardPatternColor2 || styles.boardPatternColor || '#cbd5e0'}
                                  onChange={(e) => updateStyle('boardPatternColor2', e.target.value)}
                                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={styles.boardPatternColor2 || styles.boardPatternColor || '#cbd5e0'}
                                  onChange={(e) => updateStyle('boardPatternColor2', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="#cbd5e0"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Pattern Color
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={styles.boardPatternColor || '#e5e7eb'}
                                onChange={(e) => updateStyle('boardPatternColor', e.target.value)}
                                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={styles.boardPatternColor || '#e5e7eb'}
                                onChange={(e) => updateStyle('boardPatternColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="#e5e7eb"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('Title')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openSections.Title}
              >
                <span className="font-semibold text-gray-800">Title</span>
                <span className="text-gray-500">{openSections.Title ? '−' : '+'}</span>
              </button>
              {openSections.Title && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={styles.title}
                      onChange={(e) => updateStyle('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="BINGO"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.titleColor || styles.textColor}
                        onChange={(e) => updateStyle('titleColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.titleColor || styles.textColor}
                        onChange={(e) => updateStyle('titleColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Size
                    </label>
                    <select
                      value={styles.titleSize}
                      onChange={(e) => updateStyle('titleSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                      <option value="xxlarge">Extra Extra Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.titleBackgroundColor === 'transparent' ? '#ffffff' : styles.titleBackgroundColor}
                        onChange={(e) => updateStyle('titleBackgroundColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.titleBackgroundColor}
                        onChange={(e) => updateStyle('titleBackgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="transparent"
                      />
                    </div>
                    {styles.titleBackgroundColor !== 'transparent' && (
                      <button
                        onClick={() => updateStyle('titleBackgroundColor', 'transparent')}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Reset to transparent
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cells */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('Cells')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openSections.Cells}
              >
                <span className="font-semibold text-gray-800">Cells</span>
                <span className="text-gray-500">{openSections.Cells ? '−' : '+'}</span>
              </button>
              {openSections.Cells && (
                <div className="p-4 space-y-4">
                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.textColor}
                        onChange={(e) => updateStyle('textColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.textColor}
                        onChange={(e) => updateStyle('textColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cell Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.backgroundColor}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.backgroundColor}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.borderColor}
                        onChange={(e) => updateStyle('borderColor', e.target.value)}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.borderColor}
                        onChange={(e) => updateStyle('borderColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#e5e7eb"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width: {styles.borderWidth}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={styles.borderWidth}
                      onChange={(e) => updateStyle('borderWidth', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Style
                    </label>
                    <select
                      value={styles.borderStyle}
                      onChange={(e) => updateStyle('borderStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Corner Style
                    </label>
                    <select
                      value={styles.cornerStyle}
                      onChange={(e) => updateStyle('cornerStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="square">Square</option>
                      <option value="rounded">Rounded</option>
                      <option value="very-rounded">Very Rounded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Center Square Style
                    </label>
                    <select
                      value={styles.centerStyle || 'text'}
                      onChange={(e) => updateStyle('centerStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    >
                      <option value="text">Text (FREE)</option>
                      <option value="star">Star</option>
                      <option value="sparkle">Sparkle</option>
                      <option value="heart">Heart</option>
                      <option value="circle">Circle</option>
                      <option value="image">Custom Image</option>
                    </select>
                    {styles.centerStyle === 'image' && (
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                updateStyle('centerImage', reader.result)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        {styles.centerImage && (
                          <div className="mt-2 relative">
                            <img 
                              src={styles.centerImage} 
                              alt="Center preview" 
                              className="max-w-full h-24 object-contain border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => updateStyle('centerImage', null)}
                              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Remove image
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stamps */}
            <div className="border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('Stamps')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openSections.Stamps}
              >
                <span className="font-semibold text-gray-800">Stamps</span>
                <span className="text-gray-500">{openSections.Stamps ? '−' : '+'}</span>
              </button>
              {openSections.Stamps && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stamp Style
                    </label>
                    <select
                      value={styles.stampStyle || 'none'}
                      onChange={(e) => updateStyle('stampStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    >
                      <option value="none">None</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                      <option value="checkmark">Checkmark</option>
                      <option value="circle">Circle</option>
                      <option value="xmark">X Mark</option>
                      <option value="diamond">Diamond</option>
                      <option value="image">Custom Image</option>
                    </select>
                    {styles.stampStyle === 'image' && (
                      <div className="mt-2">
                        <input
                          key={styles.stampImage ? 'has-image' : 'no-image'}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                updateStyle('stampImage', reader.result)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        {styles.stampImage && (
                          <div className="mt-2 relative">
                            <img 
                              src={styles.stampImage} 
                              alt="Stamp preview" 
                              className="max-w-full h-24 object-contain border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => {
                                updateStyle('stampImage', null)
                                updateStyle('stampCells', []) // Clear selected cells when removing image
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Remove image
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {styles.stampStyle !== 'none' && (
                      <>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stamp Size
                          </label>
                          <select
                            value={styles.stampSize || 'medium'}
                            onChange={(e) => updateStyle('stampSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="small">Small (corner)</option>
                            <option value="medium">Medium (corner)</option>
                            <option value="large">Large (full square)</option>
                          </select>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stamp Opacity: {((styles.stampOpacity !== undefined ? styles.stampOpacity : 0.4) * 100).toFixed(0)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={styles.stampOpacity !== undefined ? styles.stampOpacity : 0.4}
                            onChange={(e) => updateStyle('stampOpacity', parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stamp Position/Rotation Randomization
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={styles.stampRandomize || false}
                              onChange={(e) => updateStyle('stampRandomize', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Randomize stamp position and rotation
                            </span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 mb-2">
                          Double-click on cells or use checkboxes below to add/remove stamps.
                        </p>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Cells for Stamps
                          </label>
                          <div 
                            className="grid gap-1 p-2 border border-gray-300 rounded-lg bg-gray-50"
                            style={{
                              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                              maxWidth: `${boardSize * 40}px`,
                            }}
                          >
                            {Array.from({ length: boardSize * boardSize }, (_, index) => {
                              const row = Math.floor(index / boardSize)
                              const col = index % boardSize
                              const center = Math.floor(boardSize / 2)
                              const isCenter = row === center && col === center
                              const stampCells = styles.stampCells || []
                              const hasStamp = stampCells.includes(index)
                              
                              return (
                                <label
                                  key={index}
                                  className={`
                                    flex items-center justify-center aspect-square
                                    cursor-pointer hover:bg-gray-200
                                    ${hasStamp ? 'bg-blue-100' : ''}
                                    border border-gray-300 rounded
                                  `}
                                  title={`Cell ${index + 1}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={hasStamp}
                                    onChange={(e) => {
                                      const newStampCells = e.target.checked
                                        ? [...stampCells, index]
                                        : stampCells.filter(i => i !== index)
                                      updateStyle('stampCells', newStampCells)
                                    }}
                                    disabled={styles.stampStyle === 'none'}
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4"></div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={onRandomize}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Randomize Board
            </button>
            
            <button
              onClick={onExportPNG}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Download as PNG
            </button>
            
            <button
              onClick={onExportPDF}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StylePanel

