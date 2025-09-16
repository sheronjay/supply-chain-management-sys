import { useState } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <div className="content">
          <h1>Dashboard</h1>
          {/* <p>Welcome to your dashboard. Use the sidebar to navigate through different sections.</p> */}
        </div>
      </main>
    </div>
  )
}

export default App
