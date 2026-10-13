import './TopBar.css'

// The top row with the search box, a bell button and the user avatar
function TopBar() {
  return (
    <div className="top-bar">
      <input className="search-box" type="text" placeholder="🔍" />
      <button className="icon-button">🔔</button>
      <div className="avatar">J</div>
    </div>
  )
}

export default TopBar