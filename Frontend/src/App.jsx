import { useState } from 'react'
import Login from './components/main/Login'
import Dashboard from './components/main/Dasboard'
import Header from './components/main/Header'
import Footer from './components/main/Footer'
import { PageTransition } from './components/main/PageTransition'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isLoggedIn && <Header isLoggedIn={isLoggedIn} user={user} />}
      <main className="flex-grow">
        <PageTransition>
          {isLoggedIn ? (
            <div className="container mx-auto px-4 py-8">
              <Dashboard user={user} />
            </div>
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </PageTransition>
      </main>
      {isLoggedIn && <Footer />}
    </div>
  )
}

export default App;