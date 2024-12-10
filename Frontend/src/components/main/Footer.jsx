import { Facebook, Twitter, Rss, Github, MoreHorizontal } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold">LOGO</h2>
            <p className="text-sm text-gray-400 mt-2">SOLOGAN COMPANY</p>
          </div>

          {/* Links Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Weekly Themes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pre-sale FAQs</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Submit a Ticket</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Theme Tweak</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Showcase</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Widgetkit</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">About Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Affiliates</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Rss className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-8 text-sm text-gray-400">©Copyright. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

