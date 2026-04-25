"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold mb-4 md:mb-0 cursor-pointer">
          <Image
            src="/img/logo_wealthcar.png"
            alt="Logo Wealth Car"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span>Wealth Car</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex flex-wrap justify-center items-center gap-6">
            <li>
              <Link href="/#recursos" className="text-white/90 hover:text-white transition-colors font-semibold text-sm">
                Recursos
              </Link>
            </li>
            <li>
              <Link href="/#sobre" className="text-white/90 hover:text-white transition-colors font-semibold text-sm">
                Como Funciona
              </Link>
            </li>
            <li>
              <Link
                href="/#baixar"
                className="bg-accent hover:bg-blue-500 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Baixar App
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden absolute right-5 top-5 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-primaryHover border-t border-white/10 px-8 py-4 flex flex-col gap-4 text-white text-sm font-semibold">
          <Link href="/#recursos" onClick={() => setOpen(false)}>Recursos</Link>
          <Link href="/#sobre" onClick={() => setOpen(false)}>Como Funciona</Link>
          <Link
            href="/#baixar"
            onClick={() => setOpen(false)}
            className="bg-accent text-white px-5 py-2 rounded-full text-center"
          >
            Baixar App
          </Link>
        </div>
      )}
    </header>
  );
}
