import { Button } from '@/components/ui/button'
import { Bell, Menu, LogOut, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Header({ isLoggedIn, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-lg py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SecureVision</h1>
          </div>
          {isLoggedIn && (
            <>
              <nav className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  Settings
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </nav>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

