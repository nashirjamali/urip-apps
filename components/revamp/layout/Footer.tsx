import type React from "react";
import { ActionButton } from "../ui/ActionButton";

interface FooterProps {
  theme?: "dark" | "light";
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  theme = "light",
  className = ""
}) => {
  const isDark = theme === "dark";
  
  return (
    <footer className={`${isDark ? 'bg-black/5' : 'bg-gray-50/80'} backdrop-blur-sm border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'} ${className}`}>
      {/* CTA Section */}
      <div className={`${isDark ? 'bg-gradient-to-r from-[#F77A0E] to-[#E6690D]' : 'bg-gradient-to-r from-blue-600 to-blue-500'} rounded-2xl mx-6 mt-8 overflow-hidden`}>
        <div className="container mx-auto px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Mulai investasi sekarang
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Daftar dalam hitungan menit, langsung mulai investasi.
              </p>
              <ActionButton 
                variant="secondary" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              >
                Download Sekarang
              </ActionButton>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -top-8 -right-8"></div>
                <div className="relative z-10 flex items-center">
                  <div className="w-32 h-56 bg-white/20 rounded-2xl mr-4 flex items-center justify-center">
                    <span className="text-white/60 text-4xl">📱</span>
                  </div>
                  <div className="text-white/60 text-6xl">👨‍💼</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>URIP</span>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">📸</span>
              </div>
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">📺</span>
              </div>
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">🐦</span>
              </div>
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">📘</span>
              </div>
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">💬</span>
              </div>
              <div className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-sm">📱</span>
              </div>
            </div>

            {/* Address */}
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Trinity Tower Lantai 46, Jalan H R Rasuna Said<br />
              Kav C22, Blok IIB, Karet Kuningan, Setiabudi,<br />
              Jakarta Selatan 12940
            </p>

            <div className="mb-6">
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4`}>Mulai Investasi Sekarang</h4>
              <ActionButton 
                variant="primary" 
                size="md"
                className="w-full"
              >
                Download App URIP
              </ActionButton>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4`}>PRODUK</h4>
            <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>URIP</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>URIP Pro</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Pro Futures</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Web3</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Earn</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>URP Token</a></li>
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4`}>INFO</h4>
            <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Harga Crypto</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>FAQ</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Biaya & Limit URIP</a></li>
            </ul>
          </div>
          
          {/* Education */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4`}>EDUKASI</h4>
            <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>News</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Academy</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Kamus</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Blog</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4`}>PERUSAHAAN</h4>
            <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Tentang Kami</a></li>
              <li><a href="#" className={`hover:text-[#F77A0E] transition-colors`}>Hubungi Kami</a></li>
              <li>
                <a href="#" className={`hover:text-[#F77A0E] transition-colors flex items-center`}>
                  Karier 
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                    We're Hiring!
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className={`hover:text-[#F77A0E] transition-colors flex items-center`}>
                  Karier Engineering
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                    We're Hiring!
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'} mt-12 pt-8`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              © 2025 URIP. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#F77A0E]'} text-sm transition-colors`}>
                Syarat & Ketentuan
              </a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#F77A0E]'} text-sm transition-colors`}>
                Kebijakan Privasi
              </a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#F77A0E]'} text-sm transition-colors`}>
                Peta Situs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
