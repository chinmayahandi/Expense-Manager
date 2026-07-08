import React from "react";
import { LuWallet } from "react-icons/lu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-slate-100/80 bg-white/50 backdrop-blur-md py-5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="w-6 h-6 bg-brand text-white rounded-lg flex items-center justify-center shadow-md shadow-brand/10 shrink-0">
            <LuWallet className="text-xs" />
          </div>
          <span className="font-display font-bold text-slate-800 tracking-tight">SpendWise</span>
          <span className="text-slate-200">|</span>
          <span>&copy; {currentYear} All rights reserved.</span>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <span>Made with</span>
          <span className="text-red-500 animate-pulse text-[10px]">❤️</span>
          <span>by</span>
          <a
            href="https://github.com/chinmayahandi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-dark hover:underline font-bold transition-colors duration-200"
          >
            Chinmaya Handi
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
