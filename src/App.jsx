import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Voice from './pages/Voice.jsx'
import OCR from './pages/OCR.jsx'
import Memory from './pages/Memory.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('Home')

  // savedPhrases = phrases the user saved. They are kept in localStorage,
  // which is a small storage inside the browser, so they stay after refresh.
  // JSON.parse turns the saved text back into a list. If nothing is saved, we use [].
  const [savedPhrases, setSavedPhrases] = useState(
    JSON.parse(localStorage.getItem('lingifyPhrases')) || []
  )

  // Update the list on screen AND save it in the browser
  function savePhrases(newList) {
    setSavedPhrases(newList)
    localStorage.setItem('lingifyPhrases', JSON.stringify(newList))
  }

  return (
    <div className="app-window">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="main-area">
        {currentPage === 'Home' && (
          <Home
            setCurrentPage={setCurrentPage}
            savedPhrases={savedPhrases}
            savePhrases={savePhrases}
          />
        )}
        {currentPage === 'Voice' && <Voice />}
        {currentPage === 'OCR' && <OCR />}
        {currentPage === 'Memory' && (
          <Memory
            setCurrentPage={setCurrentPage}
            savedPhrases={savedPhrases}
            savePhrases={savePhrases}
          />
        )}

        {/* Pages that are not built yet */}
        {(currentPage === 'AI Chat' || currentPage === 'Profile') && (
          <p className="coming-soon">{currentPage} page will be built next.</p>
        )}
      </div>
    </div>
  )
}

export default App