import './Sidebar.css'

// Props: currentPage = the open page, setCurrentPage = function to change page
function Sidebar({ currentPage, setCurrentPage }) {
  // The menu items. Each one has a name and an emoji icon.
  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Voice', icon: '🎙️' },
    { name: 'OCR', icon: '🔍' },
    { name: 'AI Chat', icon: '💬' },
    { name: 'Profile', icon: '👤' },
  ]

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">∞</div>
        <div>
          <div className="logo-name">Lingify</div>
          <div className="logo-tagline">Aksharify Languages to All People</div>
        </div>
      </div>

      {/* Menu: .map() makes one button for every item in the list above */}
      <div className="menu">
        {menuItems.map((item) => (
          <button
            key={item.name}
            // If this is the open page, add the "active" class
            className={currentPage === item.name ? 'menu-button active' : 'menu-button'}
            onClick={() => setCurrentPage(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* Text at the bottom of the sidebar */}
      <div className="sidebar-footer">
        Different scripts.
        <br />
        Same human voice.
      </div>
    </div>
  )
}

export default Sidebar