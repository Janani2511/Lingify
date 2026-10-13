import '../components/TopBar.css'
import './Memory.css'

// Shows the phrases saved from ScriptBridge
function Memory({ setCurrentPage, savedPhrases, savePhrases }) {
  // Remove one phrase. .filter() keeps every item EXCEPT the one at this index.
  function deletePhrase(index) {
    const newList = savedPhrases.filter((item, i) => i !== index)
    savePhrases(newList)
  }

  function copyPhrase(text) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div>
      {/* ---------- Header ---------- */}
      <div className="memory-header">
        <div>
          <button className="back-button" onClick={() => setCurrentPage('Home')}>
            ← Back to Home
          </button>
          <h1 className="memory-title">My Language Memory</h1>
          <p className="memory-subtitle">Phrases you saved from ScriptBridge.</p>
        </div>
        <div className="avatar">J</div>
      </div>

      {/* ---------- Empty message ---------- */}
      {savedPhrases.length === 0 && (
        <div className="memory-empty">
          Nothing saved yet. Go to Home, convert a word in ScriptBridge, and click Save.
        </div>
      )}

      {/* ---------- Saved list ---------- */}
      <div className="memory-list">
        {savedPhrases.map((item, index) => (
          <div className="memory-card" key={index}>
            <div>
              <div className="memory-words">
                {item.from} → {item.to}
              </div>
              <div className="memory-language">{item.language}</div>
            </div>

            <div className="memory-buttons">
              <button className="memory-button" onClick={() => copyPhrase(item.to)}>
                Copy
              </button>
              <button className="memory-button" onClick={() => deletePhrase(index)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Memory