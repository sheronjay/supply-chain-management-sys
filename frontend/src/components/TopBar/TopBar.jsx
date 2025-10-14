import './TopBar.css'

const TopBar = ({ title, subtitle = 'Dashboard' }) => (
  <header className="topbar">
    <div className="topbar__title">
      <p className="topbar__subtitle">{subtitle}</p>
      <h1>{title}</h1>
    </div>
    <div className="topbar__actions">
      <div className="topbar__profile">
        <div className="topbar__avatar">M</div>
        <div>
          <p className="topbar__name">Muffin</p>
          <span className="topbar__role">Admin</span>
        </div>
      </div>
    </div>
  </header>
)

export default TopBar
