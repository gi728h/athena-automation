import Footer from './components/Footer'
import SideBar from './components/SideBar'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'


function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
    <div className="App">
    <div id="root" className="d-flex " style={{width: "100%"}} height="100vh">
      <SideBar />
      <div className="d-flex flex-column container-fluid p-0" style={{overflowY: "auto",height: "100vh"}}>
      <main className="flex-grow-1">
      <Routes>
      <Route path="/" element={<Home />} />
      </Routes>
      </main>
      <Footer />
      </div>
    </div>
    </div>
    </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
