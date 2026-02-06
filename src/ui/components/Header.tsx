import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const { pathname } = useLocation()
  return (
    <header className="header">
      <nav className="nav">
        <Link className={pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">Home</Link>
        <Link className={pathname.startsWith('/history') ? 'nav-link active' : 'nav-link'} to="/history">History</Link>
        <Link className={pathname.startsWith('/settings') ? 'nav-link active' : 'nav-link'} to="/settings">Settings</Link>
      </nav>
    </header>
  )
}

export default React.memo(Header)
