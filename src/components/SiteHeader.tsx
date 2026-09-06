"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["/table", "Table"],
  ["/explore", "Explore"],
  ["/learn", "Learn"],
  ["/about/data", "Data"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
          <span className="wordmarkOrb" aria-hidden="true">π</span>
          <span>The Sphere Atlas</span>
        </Link>
        <button
          className="menuButton"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="primary-navigation" className={open ? "primaryNav navOpen" : "primaryNav"} aria-label="Primary">
          {links.map(([href, label]) => (
            <Link
              href={href}
              key={href}
              className={pathname.startsWith(href) ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
