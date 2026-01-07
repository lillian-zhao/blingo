// Simple component to test if fonts are loading
// You can temporarily add this to App.jsx to debug font loading

export default function FontTest() {
  const fonts = ['Array', 'Boxing', 'Nunito', 'Stardom', 'Telma']
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">Font Loading Test</h3>
      {fonts.map(font => (
        <div key={font} style={{ fontFamily: `${font}, sans-serif` }}>
          <strong>{font}:</strong> The quick brown fox jumps over the lazy dog
        </div>
      ))}
    </div>
  )
}

