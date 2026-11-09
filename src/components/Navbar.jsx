import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'About', id: 'about' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-slate-950/95 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        <a href="#home" className="text-2xl font-bold text-cyan-400">
          TechNova.
        </a>

        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="hover:text-cyan-400 transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col bg-slate-900 px-6 pb-5 gap-5">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-cyan-400"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar