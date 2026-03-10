import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowUpRight, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f4f4f2] border-t-4 border-black mt-auto">
      {/* Visual Accent Bar */}
      <div className="bg-yellow-400 border-b-2 border-black py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-fast">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] mx-10 text-black">
              Dealer to Dealer Network • B2B Only • Lagos • Abuja • Port Harcourt • ibadan • benin • across nigeria
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-6">
              <div className="bg-black p-1.5 border-2 border-black">
                <Car size={20} className="text-white" />
              </div>
              <span className="font-black text-2xl uppercase tracking-tighter ml-3">
                AutoDealer<span className="text-yellow-500 italic">®</span>
              </span>
            </div>
            <p className="text-sm font-bold uppercase leading-relaxed max-w-sm text-slate-600">
              The institutional standard for high-velocity automotive trading. 
              Built for dealers who move units, not iron.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black border-l-4 border-yellow-400 pl-3">
              Market Access
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/search">Registry</FooterLink>
              <FooterLink to="/distress">Distress Feed</FooterLink>
              <FooterLink to="/subscriptions">Credit Plans</FooterLink>
              <FooterLink to="/about">Protocol</FooterLink>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black border-l-4 border-black pl-3">
              Direct Terminal
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="p-2 border-2 border-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">support@autodealer.ng</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 border-2 border-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 border-2 border-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Globe size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">HQ: Victoria Island, Lagos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED. AUTODEALER TECH.
          </p>
          <div className="flex space-x-6">
            <button className="text-[10px] font-black uppercase hover:text-yellow-500 transition-colors">Privacy</button>
            <button className="text-[10px] font-black uppercase hover:text-yellow-500 transition-colors">Compliance</button>
            <button className="text-[10px] font-black uppercase hover:text-yellow-500 transition-colors">API</button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3%); }
        }
        .animate-marquee-fast {
          display: inline-flex;
          animation: marquee-fast 15s linear infinite;
        }
      `}} />
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black hover:pl-2 transition-all flex items-center group"
    >
      {children}
      <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  </li>
);

export default Footer;