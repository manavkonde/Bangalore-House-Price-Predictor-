import { motion } from "framer-motion";
import { Building2, Github, Twitter, Linkedin, Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-900" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-gold">
                <Building2 className="h-6 w-6 text-navy-900" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">BangaloreHomes</h3>
                <p className="text-xs text-gold-400/70 font-semibold uppercase tracking-widest">Price Predictor</p>
              </div>
            </div>
            <p className="text-white/40 max-w-sm text-sm leading-relaxed mb-6">
              AI-powered real estate price prediction for India's top cities. Get accurate estimates 
              based on location, size, and market intelligence.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a href="mailto:hello@bangalorehomes.ai" className="flex items-center gap-2 text-white/30 hover:text-gold-400 transition-colors text-sm">
                <Mail className="h-4 w-4" /> hello@bangalorehomes.ai
              </a>
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <MapPin className="h-4 w-4" /> Bangalore, India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Price Prediction", href: "/estimate-price" },
                { label: "Map View", href: "/map" },
                { label: "Nearby Amenities", href: "/nearby-amenities" },
                { label: "Compare Areas", href: "/comparison" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-white/40 hover:text-gold-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-5">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:border-transparent hover:text-navy-900 text-white/40 transition-all duration-300 hover:shadow-gold hover:scale-105"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} BangaloreHomes. All rights reserved.
          </p>
          <p className="text-sm text-white/25 flex items-center gap-1.5">
            Made with <Heart className="h-4 w-4 text-red-400 fill-red-400 animate-pulse" /> for India
          </p>
        </div>
      </div>
    </footer>
  );
}
