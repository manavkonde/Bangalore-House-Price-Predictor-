import { motion } from "framer-motion";
import { Building2, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">BangaloreHomes</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Price Predictor</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/estimate-price" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Predict
            </Link>
            <Link to="/comparison" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Compare
            </Link>
            <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Map View
            </Link>
            <Link to="/nearby-amenities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Amenities
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <nav className="flex flex-col gap-2">
              <Link to="/estimate-price" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                Predict
              </Link>
              <Link to="/comparison" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                Compare
              </Link>
              <Link to="/map" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                Map View
              </Link>
              <Link to="/nearby-amenities" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                Amenities
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="justify-start mt-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="hero" size="sm" className="mt-2" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
