import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import './Home.css'

const languages = [
  { name: 'Tamil', code: 'ta' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Malayalam', code: 'ml' },
]

// Props: setCurrentPage opens another page, savedPhrases/savePhrases is the Memory list
function Home({ setCurrentPage, savedPhrases, savePhrases }) {
  const [text, setText] = useState('')
  const [languageName, setLanguageName] = useState('Tamil')
  const [result, setResult] = useState('')
  const [options, setOptions] = useState([])
  const [message, setMessage] = useState('')

  const [recent, setRecent] = useState([
    { from: 'Vanakkam', to: 'வணக்கம்', language: 'Tamil', time: '2m ago' },
    { from: 'Namaste', to: 'नमस्ते', language: 'Hindi', time: '12m ago' },
    { from: 'Hello', to: 'ಹಲೋ', language: 'Kannada', time: '20m ago' },
    { from: 'Nandri', to: 'നന്ദി', language: 'Malayalam', time: '32m ago' },
  ])

  // page = the page that opens when the card is clicked.
  // ScriptBridge has no page because its box is right below on this screen.
  const features = [
    { title: 'ScriptBridge', text: 'Type in Roman, get native script', icon: '🔤', color: '#4f7cff', page: '' },
    { title: 'Live Language Bridge', text: 'Real-time conversation mode', icon: '💬', color: '#2bb5a0', page: 'Voice' },
    { title: 'ScriptLens', text: 'Extract text from images', icon: '📷', color: '#8b7cf6', page: 'OCR' },
    { title: 'My Language Memory', text: 'Save & reuse your phrases', icon: '🔖', color: '#e0a43a', page: 'Memory' },
  ]

  async function convertText() {
    if (text.trim() === '') {
      setMessage('Please type a word first.')
      return
    }

    const chosen = languages.find((lang) => lang.name === languageName)
    setMessage('Converting...')

    try {
      const url =
        'https://inputtools.google.com/request?text=' +
        encodeURIComponent(text) +
        '&itc=' +
        chosen.code +
        '-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage'

      const response = await fetch(url)
      const data = await response.json()

      if (data[0] !== 'SUCCESS') {
        setMessage('Could not convert this text.')
        return
      }

      const suggestions = data[1][0][1]

      setResult(suggestions[0])
      setOptions(suggestions)
      setMessage('')

      const newItem = { from: text, to: suggestions[0], language: languageName, time: 'just now' }
      setRecent([newItem, ...recent].slice(0, 4))
    } catch (error) {
      setMessage('Conversion failed. Please check your internet.')
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    setMessage('Copied!')
  }

  // Save the result into My Language Memory
  function saveResult() {
    const newItem = { from: text, to: result, language: languageName }
    savePhrases([newItem, ...savedPhrases]) // new item first, then the old ones
    setMessage('Saved to My Language Memory!')
  }

  // When a card is clicked: open its page (if it has one)
  function openCard(page) {
    if (page !== '') {
      setCurrentPage(page)
    }
  }

  return (
    <div>
      {/* ---------- Header ---------- */}
      <div className="home-header">
        <div>
          <h1 className="welcome-title">Welcome back, Janani! 👋</h1>
          <p className="welcome-text">Break language barriers. Connect beyond words.</p>
        </div>
        <TopBar />
      </div>

      {/* ---------- Hero banner ---------- */}
      <div className="hero">
        <div className="hero-left">
          <h2 className="hero-title">
            Translate
            <br />
            Transliterate
            <br />
            Connect
          </h2>
          <p className="hero-text">
            Convert text from one language to another with ease. Explore the world of languages!
          </p>
          <button className="hero-button">Explore Features →</button>
        </div>

        <div className="hero-art">
          <div className="globe"></div>
          <span className="script s1">अ</span>
          <span className="script s2">ಡ</span>
          <span className="script s3">ञ</span>
          <span className="script s4">आ</span>
          <span className="script s5">가</span>
          <span className="script s6">ಅ</span>
        </div>
      </div>

      {/* ---------- 4 feature cards (click to open) ---------- */}
      <div className="feature-row">
        {features.map((item) => (
          <div
            // Cards that have a page get the "clickable" class (hand cursor)
            className={item.page === '' ? 'feature-card' : 'feature-card clickable'}
            key={item.title}
            onClick={() => openCard(item.page)}
          >
            <div className="feature-icon" style={{ background: item.color }}>
              {item.icon}
            </div>
            <div>
              <div className="feature-title">{item.title}</div>
              <div className="feature-text">{item.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- ScriptBridge ---------- */}
      <div className="bridge-box">
        <h3 className="bridge-title">ScriptBridge</h3>

        <div className="bridge-row">
          <input
            className="bridge-input"
            type="text"
            placeholder="Type in English letters, for example: vanakkam"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') convertText()
            }}
          />

          <select
            className="bridge-select"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>

          <button className="bridge-button" onClick={convertText}>
            Convert
          </button>
        </div>

        {message !== '' && <p className="bridge-message">{message}</p>}

        {result !== '' && (
          <div className="bridge-result">
            <div className="bridge-result-top">
              <span className="bridge-result-text">{result}</span>
              <div className="bridge-actions">
                <button className="bridge-copy" onClick={copyResult}>
                  Copy
                </button>
                <button className="bridge-copy" onClick={saveResult}>
                  Save
                </button>
              </div>
            </div>

            <div className="bridge-options">
              {options.map((option) => (
                <button key={option} className="bridge-option" onClick={() => setResult(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Recent Transliterations ---------- */}
      <div className="recent-header">
        <h3 className="recent-title">Recent Transliterations</h3>
        <button className="view-all">View All →</button>
      </div>

      <div className="recent-row">
        {recent.map((item, index) => (
          <div className="recent-card" key={index}>
            <div className="recent-words">
              {item.from} → {item.to}
            </div>
            <div className="recent-language">{item.language}</div>
            <div className="recent-time">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home