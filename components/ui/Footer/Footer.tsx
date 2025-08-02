import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-[#F77A0E]">
      <p className="text-xs text-black">© 2024 URIP. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs text-black hover:underline">
          Terms & Conditions
        </Link>
        <Link href="#" className="text-xs text-black hover:underline">
          Privacy Policy
        </Link>
        <Link href="#" className="text-xs text-black hover:underline">
          Contact
        </Link>
      </nav>
    </footer>
  );
}
