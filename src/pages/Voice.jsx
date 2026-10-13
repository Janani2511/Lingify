import { useState, useRef } from 'react'
import '../components/TopBar.css'
import './Voice.css'

const languages = [
  { name: 'English', speechCode: 'en-US', translateCode: 'en' },
  { name: 'Tamil', speechCode: 'ta-IN', translateCode: 'ta' },
  { name: 'Hindi', speechCode: 'hi-IN', translateCode: 'hi' },
  { name: 'Kannada', speechCode: 'kn-IN', translateCode: 'kn' },
  { name: 'Malayalam', speechCode: 'ml-IN', translateCode: 'ml' },
]

function Voice() {
  const [isListening, setIsListening] = useState(false)
  const [fromLanguage, setFromLanguage] = useState('English')
  const [toLanguage, setToLanguage] = useState('Tamil')

  // spokenText = what the mic heard
  // translatedText = the meaning in the other language
  // transliteratedText = the same sounds written in the other script
  const [spokenText, setSpokenText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [transliteratedText, setTransliteratedText] = useState('')
  const [message, setMessage] = useState('')

  const recognitionRef = useRef(null)

  const fromInfo = languages.find((lang) => lang.name === fromLanguage)
  const toInfo = languages.find((lang) => lang.name === toLanguage)

  const barHeights = [10, 18, 28, 16, 34, 22, 40, 26, 14, 8]

  const moreFeatures = [
    { text: 'Real-time translation', icon: '⚡' },
    { text: 'Multiple speakers', icon: '👥' },
    { text: 'Save to history', icon: '🕘' },
  ]

  // The grey hint shown in the transliteration box before there is a result
  let transliterationHint = 'The transliteration will appear here'
  if (fromInfo.translateCode !== 'en') {
    transliterationHint = 'Transliteration works when "From" is English'
  } else if (toInfo.translateCode === 'en') {
    transliterationHint = 'Choose a different "To" language'
  }

  function swapLanguages() {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
  }

  // Translation: changes the MEANING into another language
  async function translateText(text) {
    if (fromInfo.translateCode === toInfo.translateCode) {
      setTranslatedText(text)
      return
    }

    setMessage('Translating...')

    try {
      const url =
        'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text) +
        '&langpair=' +
        fromInfo.translateCode +
        '|' +
        toInfo.translateCode

      const response = await fetch(url)
      const data = await response.json()

      setTranslatedText(data.responseData.translatedText)
      setMessage('')
    } catch (error) {
      setMessage('Translation failed. Please check your internet.')
    }
  }

  // Transliteration: writes the SAME SOUNDS in another script.
  // It only works for English letters, so "From" must be English.
  async function transliterateText(text) {
    if (fromInfo.translateCode !== 'en' || toInfo.translateCode === 'en') {
      setTransliteratedText('')
      return
    }

    try {
      const url =
        'https://inputtools.google.com/request?text=' +
        encodeURIComponent(text) +
        '&itc=' +
        toInfo.translateCode +
        '-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage'

      const response = await fetch(url)
      const data = await response.json()

      if (data[0] === 'SUCCESS') {
        setTransliteratedText(data[1][0][1][0])
      } else {
        setTransliteratedText('Could not convert this text.')
      }
    } catch (error) {
      setTransliteratedText('Transliteration failed. Check your internet.')
    }
  }

  function toggleMic() {
    if (isListening) {
      recognitionRef.current.stop()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMessage('Speech recognition is not supported here. Please use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = fromInfo.speechCode

    recognition.onstart = () => {
      setIsListening(true)
      setMessage('')
    }

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setSpokenText(text)
      setTranslatedText('')
      setTransliteratedText('')
      translateText(text) // meaning
      transliterateText(text) // sounds in native script
    }

    recognition.onerror = () => {
      setMessage('Could not hear you. Allow the microphone and try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  // Read a text out loud. The language code decides the voice.
  function speak(text) {
    if (text === '') {
      return
    }
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = toInfo.speechCode
    window.speechSynthesis.speak(speech)
  }

  return (
    <div>
      {/* ---------- Header ---------- */}
      <div className="voice-header">
        <div className="voice-heading">
          <div className="voice-heading-icon">🎙️</div>
          <div>
            <h1 className="voice-title">Voice Translation</h1>
            <p className="voice-subtitle">Speak, get it transcribed and translated instantly.</p>
          </div>
        </div>

        <div className="voice-header-right">
          <button className="icon-button">⚙️</button>
          <div className="avatar">J</div>
        </div>
      </div>

      {/* ---------- Mic ---------- */}
      <div className="mic-area">
        <div className="mic-row">
          <div className={isListening ? 'wave listening' : 'wave'}>
            {barHeights.map((height, index) => (
              <span key={index} className="bar" style={{ height: height }}></span>
            ))}
          </div>

          <button
            className={isListening ? 'mic-button listening' : 'mic-button'}
            onClick={toggleMic}
          >
            🎙️
          </button>

          <div className={isListening ? 'wave listening' : 'wave'}>
            {barHeights.map((height, index) => (
              <span key={index} className="bar" style={{ height: height }}></span>
            ))}
          </div>
        </div>

        <p className="mic-text">{isListening ? 'Listening...' : 'Tap to start speaking'}</p>
        {message !== '' && <p className="status-message">{message}</p>}
      </div>

      {/* ---------- From / To ---------- */}
      <div className="language-row">
        <div className="language-box">
          <label className="language-label">From</label>
          <select
            className="language-select"
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button className="swap-button" onClick={swapLanguages}>
          ⇄
        </button>

        <div className="language-box">
          <label className="language-label">To</label>
          <select
            className="language-select"
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Result box: 3 parts ---------- */}
      <div className="result-box">
        {/* Part 1: what you said */}
        <div className="result-section">
          <div className="result-top">
            <span className="result-label">You said</span>
            <span className="result-language">{fromLanguage}</span>
          </div>
          <p className={spokenText === '' ? 'result-text placeholder' : 'result-text'}>
            {spokenText === '' ? 'What you say will appear here' : spokenText}
          </p>
        </div>

        {/* Part 2: translation (meaning) */}
        <div className="result-section">
          <div className="result-top">
            <span className="result-label">Translation (meaning)</span>
            <span className="result-language">{toLanguage}</span>
          </div>
          <div className="result-bottom">
            <p className={translatedText === '' ? 'result-text placeholder' : 'result-text'}>
              {translatedText === '' ? 'The translation will appear here' : translatedText}
            </p>
            <button className="play-button" onClick={() => speak(translatedText)}>
              ▶
            </button>
          </div>
        </div>

        {/* Part 3: transliteration (sound in the other script) */}
        <div className="result-section">
          <div className="result-top">
            <span className="result-label">Transliteration (sound in {toLanguage} letters)</span>
            <span className="result-language">{toLanguage}</span>
          </div>
          <p className={transliteratedText === '' ? 'result-text placeholder' : 'result-text'}>
            {transliteratedText === '' ? transliterationHint : transliteratedText}
          </p>
        </div>
      </div>

      {/* ---------- More Voice Features ---------- */}
      <h3 className="more-title">More Voice Features</h3>
      <div className="more-row">
        {moreFeatures.map((item) => (
          <div className="more-chip" key={item.text}>
            <span>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Voice