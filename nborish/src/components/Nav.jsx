import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, User, Briefcase, Code, Terminal, Award, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { href: "#about",      label: "About",      icon: User },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#projects",   label: "Projects",   icon: Code },
  { href: "#skills",     label: "Skills",     icon: Terminal },
  { href: "#honors",     label: "Honors",     icon: Award },
  { href: "#contact",    label: "Contact",    icon: Mail },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map(l => l.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className={`nav${scrolled ? " nav--scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a className="nav-logo" href="#top" onClick={() => handleNav("#top")}>
            NBS<span>_</span>PORTFOLIO
          </a>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className={active === href.slice(1) ? "nav-link nav-link--active" : "nav-link"}
                  onClick={(e) => { e.preventDefault(); handleNav(href); }}
                  aria-current={active === href.slice(1) ? "page" : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Icon size={14} />
                  <span>{label.toUpperCase()}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span className={`theme-icon ${theme === "dark" ? "theme-icon--visible" : ""}`}>
                <Sun size={16} />
              </span>
              <span className={`theme-icon ${theme === "light" ? "theme-icon--visible" : ""}`}>
                <Moon size={16} />
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div id="mobile-menu" className={`nav-drawer${open ? " nav-drawer--open" : ""}`} aria-hidden={!open}>
        <ul role="list">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href.slice(1) ? "nav-link nav-link--active" : "nav-link"}
                onClick={(e) => { e.preventDefault(); handleNav(href); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
