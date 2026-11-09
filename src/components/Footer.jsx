function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-cyan-400">
          TechNova.
        </h2>

        <p>© 2026 TechNova. All rights reserved.</p>

        <a href="#home" className="hover:text-cyan-400">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

export default Footer