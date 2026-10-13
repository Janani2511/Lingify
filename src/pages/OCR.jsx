import { useState } from 'react'
import Tesseract from 'tesseract.js'
import '../components/TopBar.css'
import './OCR.css'

// code = the language name that Tesseract understands
const languages = [
  { name: 'Tamil', code: 'tam' },
  { name: 'Hindi', code: 'hin' },
  { name: 'Kannada', code: 'kan' },
  { name: 'Malayalam', code: 'mal' },
  { name: 'English', code: 'eng' },
]

// Looks at the letters in the text and guesses the language and script.
// Each /[...]/ checks if the text has letters from that script.
function detectScript(text) {
  if (/[\u0B80-\u0BFF]/.test(text)) return { language: 'Tamil', script: 'Tamil' }
  if (/[\u0900-\u097F]/.test(text)) return { language: 'Hindi', script: 'Devanagari' }
  if (/[\u0C80-\u0CFF]/.test(text)) return { language: 'Kannada', script: 'Kannada' }
  if (/[\u0D00-\u0D7F]/.test(text)) return { language: 'Malayalam', script: 'Malayalam' }
  if (/[A-Za-z]/.test(text)) return { language: 'English', script: 'Latin' }
  return { language: '-', script: '-' }
}

function OCR() {
  const [file, setFile] = useState(null) // the chosen image file
  const [imageUrl, setImageUrl] = useState('') // a link used to show a preview
  const [languageName, setLanguageName] = useState('Tamil')
  const [text, setText] = useState('') // the extracted text
  const [status, setStatus] = useState('')
  const [isWorking, setIsWorking] = useState(false)

  const detected = detectScript(text)

  const chips = [
    { text: 'Auto detect language', icon: '🌐' },
    { text: 'Identify script', icon: '🔤' },
    { text: 'Edit & copy text', icon: '✏️' },
    { text: 'Download as file', icon: '⬇️' },
  ]

  // Runs when a file is chosen or dropped
  function chooseFile(newFile) {
    if (!newFile) return

    if (!newFile.type.startsWith('image/')) {
      setStatus('Please choose an image (JPG or PNG). PDF is not supported yet.')
      return
    }

    setFile(newFile)
    setImageUrl(URL.createObjectURL(newFile)) // makes a temporary link for the preview
    setText('')
    setStatus('')
  }

  // Runs when the user drops a file on the box
  function handleDrop(e) {
    e.preventDefault() // stops the browser from opening the image
    chooseFile(e.dataTransfer.files[0])
  }

  // Reads the text from the image using Tesseract
  async function extractText() {
    if (file === null) {
      setStatus('Please choose an image first.')
      return
    }

    const chosen = languages.find((lang) => lang.name === languageName)

    setIsWorking(true)
    setText('')
    setStatus('Starting... (the first time it downloads the language data)')

    try {
      const result = await Tesseract.recognize(file, chosen.code, {
        // logger runs again and again while Tesseract works, so we can show progress
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setStatus('Reading image... ' + Math.round(info.progress * 100) + '%')
          }
        },
      })

      setText(result.data.text)

      if (result.data.text.trim() === '') {
        setStatus('No text found. Try a clearer image or another language.')
      } else {
        setStatus('')
      }
    } catch (error) {
      setStatus('Could not read the image. Check your internet and try again.')
    }

    setIsWorking(false)
  }

  function copyText() {
    navigator.clipboard.writeText(text)
    setStatus('Copied!')
  }

  // Makes a .txt file from the text and downloads it
  function downloadText() {
    if (text === '') return

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'extracted-text.txt'
    link.click()
  }

  // What each chip does when clicked
  function clickChip(name) {
    if (name === 'Edit & copy text') copyText()
    if (name === 'Download as file') downloadText()
  }

  return (
    <div>
      {/* ---------- Header ---------- */}
      <div className="ocr-header">
        <div>
          <h1 className="ocr-title">Image to Text</h1>
          <p className="ocr-subtitle">Scan or upload an image to extract text in any language.</p>
        </div>
        <div className="ocr-header-right">
          <button className="icon-button">⚙️</button>
          <div className="avatar">J</div>
        </div>
      </div>

      <div className="ocr-body">
        {/* ---------- Left: upload box ---------- */}
        <div
          className="upload-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* If an image is chosen, show it. Otherwise show the upload hint. */}
          {imageUrl !== '' ? (
            <img className="preview-image" src={imageUrl} alt="Your upload" />
          ) : (
            <div>
              <div className="upload-icon">🖼️</div>
              <p className="upload-text">Drag & drop an image here</p>
              <p className="upload-text">or click to upload</p>
              <p className="upload-small">Supports JPG, PNG</p>
            </div>
          )}

          {/* The label works like a button. The real file input is hidden. */}
          <label className="choose-button">
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => chooseFile(e.target.files[0])}
            />
          </label>

          <div className="extract-row">
            <select
              className="ocr-select"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button className="extract-button" onClick={extractText} disabled={isWorking}>
              {isWorking ? 'Reading...' : 'Extract Text'}
            </button>
          </div>
        </div>

        {/* ---------- Right: extracted text ---------- */}
        <div className="text-panel">
          <div className="text-panel-top">
            <span className="text-panel-title">Extracted Text</span>
            <button className="copy-button" onClick={copyText}>
              Copy
            </button>
          </div>

          {/* The text can be edited, so we use a textarea */}
          <textarea
            className="text-area"
            value={text}
            placeholder="The extracted text will appear here"
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {status !== '' && <p className="ocr-status">{status}</p>}

          <div className="detect-row">
            <div>
              <div className="detect-label">Detected Language</div>
              <span className="language-tag">{detected.language}</span>
            </div>
            <div>
              <div className="detect-label">Script</div>
              <div className="detect-value">{detected.script}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Chips ---------- */}
      <div className="chip-row">
        {chips.map((item) => (
          <button className="chip" key={item.text} onClick={() => clickChip(item.text)}>
            <span>{item.icon}</span>
            {item.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OCR 