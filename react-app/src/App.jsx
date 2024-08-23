import Footer from './components/Footer'
import SideBar from './components/SideBar'
import React from 'react'
import Home from './pages/Home'
import { AppContext } from './AppContext'
import Table from './pages/Table'
import { useLocation } from 'react-router-dom';
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'


function App() {
  const [Page, setPage] = React.useState("Home")

  const location = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <AppContext.Provider value={{ Page, setPage }}>
          <div className="App">

            <div id="root" className={`d-flex ${hideSidebar && "justify-content-center mt-5" }`} style={{ width: "100%"}} height="100%">
              {!hideSidebar ? <>
                <SideBar />
                <div className="d-flex flex-column container-fluid p-0" style={{ overflowY: "auto", height: "100vh" }}>
                  <main className="flex-grow-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/table" element={<Table />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </> : <>
              <Routes>
                      <Route path="/login" element={<Login />} />
              </Routes>
              </>}
            </div>
          </div>
    </AppContext.Provider>
  )
}

export default App
