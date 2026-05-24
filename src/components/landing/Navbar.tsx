'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e8e8e8]" style={{ height: 64 }}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-[18px] text-[#4d4d4d]">Hyve Codex</span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: '#fdf3d0', color: '#ffc107' }}
            >
              Beta
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[14px] font-medium text-[#4d4d4d] hover:text-[#ffc107] transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-[14px] font-bold text-[#4d4d4d] px-5 py-2.5 rounded-[10px] transition-colors duration-150"
              style={{ background: '#ffc107' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e6ac00')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ffc107')}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 text-[#4d4d4d]"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-t border-[#e8e8e8] px-6 py-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="text-[14px] font-medium text-[#4d4d4d] py-2"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-[14px] font-bold text-[#4d4d4d] py-2.5 px-5 rounded-[10px] text-center"
              style={{ background: '#ffc107' }}
              onClick={() => setMobileOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>
      {/* Spacer to push content below fixed nav */}
      <div style={{ height: 64 }} />
    </>
  )
}
