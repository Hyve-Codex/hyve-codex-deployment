export default function Footer() {
  return (
    <footer style={{ background: '#1a1a1a', paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Left */}
          <div>
            <p className="font-extrabold text-white" style={{ fontSize: 16 }}>
              Hyve Codex
            </p>
            <p className="text-white mt-1" style={{ fontSize: 12, opacity: 0.4 }}>
              Built by The Hyve Hamptons.
            </p>
          </div>

          {/* Center */}
          <nav className="flex items-center gap-6">
            {[
              { label: 'Changelog', href: '/changelog' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Contact', href: 'mailto:support@thehyvehamptons.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white transition-opacity duration-150 hover:opacity-80"
                style={{ fontSize: 13, opacity: 0.5 }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <p className="text-white" style={{ fontSize: 12, opacity: 0.4 }}>
            © 2026 Hyve Codex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
