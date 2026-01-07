import { useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function useExport() {
  const boardRef = useRef(null)

  const exportToPNG = useCallback(async () => {
    if (!boardRef?.current) return

    try {
      // Wait for fonts to load
      await document.fonts.ready
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(boardRef.current, {
        scale: 2,
        backgroundColor: null, // Use null to capture actual background
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: boardRef.current.scrollWidth,
        windowHeight: boardRef.current.scrollHeight,
        onclone: (clonedDoc, element) => {
          // Convert textareas to divs for proper text wrapping in export
          const textareas = clonedDoc.querySelectorAll('textarea')
          textareas.forEach((textarea) => {
            const computedStyle = clonedDoc.defaultView.getComputedStyle(textarea)
            const div = clonedDoc.createElement('div')
            div.textContent = textarea.value || textarea.placeholder
            div.className = textarea.className.replace('resize-none', '').trim()
            // Copy all styles
            div.style.color = computedStyle.color
            div.style.fontSize = computedStyle.fontSize
            div.style.fontFamily = computedStyle.fontFamily
            div.style.fontWeight = computedStyle.fontWeight
            div.style.fontStyle = computedStyle.fontStyle
            div.style.lineHeight = computedStyle.lineHeight
            div.style.width = computedStyle.width
            div.style.height = computedStyle.height
            div.style.padding = computedStyle.padding
            div.style.margin = computedStyle.margin
            div.style.boxSizing = 'border-box'
            // Ensure proper wrapping
            div.style.display = 'flex'
            div.style.alignItems = 'center'
            div.style.justifyContent = 'center'
            div.style.textAlign = 'center'
            div.style.wordBreak = 'break-word'
            div.style.wordWrap = 'break-word'
            div.style.whiteSpace = 'normal'
            div.style.overflowWrap = 'break-word'
            div.style.overflow = 'hidden'
            div.style.background = 'transparent'
            div.style.border = 'none'
            div.style.outline = 'none'
            textarea.parentNode.replaceChild(div, textarea)
          })
        },
      })

      const link = document.createElement('a')
      link.download = 'bingo-board.png'
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    } catch (error) {
      console.error('Error exporting PNG:', error)
      alert('Failed to export PNG. Please try again.')
    }
  }, [])

  const exportToPDF = useCallback(async () => {
    if (!boardRef?.current) return

    try {
      // Wait for fonts to load
      await document.fonts.ready
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(boardRef.current, {
        scale: 2,
        backgroundColor: null, // Use null to capture actual background
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: boardRef.current.scrollWidth,
        windowHeight: boardRef.current.scrollHeight,
        onclone: (clonedDoc, element) => {
          // Convert textareas to divs for proper text wrapping in export
          const textareas = clonedDoc.querySelectorAll('textarea')
          textareas.forEach((textarea) => {
            const computedStyle = clonedDoc.defaultView.getComputedStyle(textarea)
            const div = clonedDoc.createElement('div')
            div.textContent = textarea.value || textarea.placeholder
            div.className = textarea.className.replace('resize-none', '').trim()
            // Copy all styles
            div.style.color = computedStyle.color
            div.style.fontSize = computedStyle.fontSize
            div.style.fontFamily = computedStyle.fontFamily
            div.style.fontWeight = computedStyle.fontWeight
            div.style.fontStyle = computedStyle.fontStyle
            div.style.lineHeight = computedStyle.lineHeight
            div.style.width = computedStyle.width
            div.style.height = computedStyle.height
            div.style.padding = computedStyle.padding
            div.style.margin = computedStyle.margin
            div.style.boxSizing = 'border-box'
            // Ensure proper wrapping
            div.style.display = 'flex'
            div.style.alignItems = 'center'
            div.style.justifyContent = 'center'
            div.style.textAlign = 'center'
            div.style.wordBreak = 'break-word'
            div.style.wordWrap = 'break-word'
            div.style.whiteSpace = 'normal'
            div.style.overflowWrap = 'break-word'
            div.style.overflow = 'hidden'
            div.style.background = 'transparent'
            div.style.border = 'none'
            div.style.outline = 'none'
            textarea.parentNode.replaceChild(div, textarea)
          })
        },
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = (pdfHeight - imgHeight * ratio) / 2

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('bingo-board.pdf')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }, [])

  return {
    boardRef,
    exportToPNG,
    exportToPDF,
  }
}

