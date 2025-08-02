import Link from "next/link";
import React from "react";
import { Button } from "../button";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NavItems: NavItem[] = [
  {
    label: "Features",
    href: "#features",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path></svg>`,
  },
  {
    label: "Solution",
    href: "#solution",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 5V19H20V7H11.5858L9.58579 5H4ZM12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"></path></svg>`,
  },
  {
    label: "About",
    href: "#about",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21.7267 2.95694L16.2734 22.0432C16.1225 22.5716 15.7979 22.5956 15.5563 22.1126L11 13L1.9229 9.36919C1.41322 9.16532 1.41953 8.86022 1.95695 8.68108L21.0432 2.31901C21.5716 2.14285 21.8747 2.43866 21.7267 2.95694ZM19.0353 5.09647L6.81221 9.17085L12.4488 11.4255L15.4895 17.5068L19.0353 5.09647Z"></path></svg>`,
  },
];

export default function Header() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50 w-auto mx-auto max-w-7xl py-3 px-6 rounded-2xl backdrop-filter backdrop-blur-2xl bg-black/20 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-black/15 transition-all duration-300 hover:bg-black/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Link href="#" className="flex items-center space-x-2 font-semibold">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-bold text-white hover:text-gray-300 transition-colors">
              URIP
            </span>
          </Link>
        </div>
        <div className="space-x-10 flex-1 flex justify-center items-center">
          {NavItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              {label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="#"
            className="flex items-center space-x-2 rounded-xl hover:bg-white/20 px-4 py-2 transition-all duration-200 text-gray-300 hover:text-white backdrop-filter backdrop-blur-sm"
          >
            <span className="text-sm font-medium">Login</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-white/40 text-gray-300 hover:bg-white/20 hover:text-white backdrop-filter backdrop-blur-sm bg-white/10 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl border-2"
          >
            Register
          </Button>
        </div>
      </div>
    </nav>
  );
}
