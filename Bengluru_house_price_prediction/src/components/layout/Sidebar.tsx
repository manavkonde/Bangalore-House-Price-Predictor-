import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calculator, 
  GitCompare, 
  Map, 
  MapPin, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Home,
  Sparkles,
  Moon,
  Sun,
  Monitor,
  IndianRupee,
  TrendingUp,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    title: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    title: "Estimate Price", 
    href: "/estimate-price", 
    icon: Calculator 
  },
  { 
    title: "Comparison", 
    href: "/comparison", 
    icon: GitCompare 
  },
  { 
    title: "Map View", 
    href: "/map", 
    icon: Map 
  },
  { 
    title: "Nearby Amenities", 
    href: "/nearby-amenities", 
    icon: MapPin 
  },
  {
    title: "Data Health",
    href: "/data-health",
    icon: Database
  },
  {
    title: "EMI Calculator",
    href: "/emi-calculator",
    icon: IndianRupee
  },
  {
    title: "ROI Analyzer",
    href: "/roi-analyzer",
    icon: TrendingUp
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 270 }}
        className={cn(
          "fixed left-0 top-0 h-screen z-50 flex flex-col",
          "bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900",
          "border-r border-white/5",
          "lg:relative lg:z-0",
          collapsed ? "w-20" : "w-[270px]"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-white/5 h-[72px]">
          <div 
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-gold cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Building2 className="h-5 w-5 text-navy-900" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden cursor-pointer"
                onClick={() => navigate("/")}
              >
                <h1 className="font-display font-bold text-base text-white whitespace-nowrap tracking-tight">
                  BangaloreHomes
                </h1>
                <p className="text-[10px] text-gold-400/80 whitespace-nowrap font-semibold uppercase tracking-widest">
                  Price Predictor
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Home link */}
          <NavLink
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              "hover:bg-white/5",
              location.pathname === "/" && "bg-white/10",
              collapsed && "justify-center"
            )}
          >
            <Home className={cn("h-5 w-5 shrink-0", location.pathname === "/" ? "text-gold-400" : "text-white/40")} />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn(
                    "text-sm font-medium whitespace-nowrap overflow-hidden",
                    location.pathname === "/" ? "text-white" : "text-white/60"
                  )}
                >
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>

          {/* Divider */}
          <div className="h-px bg-white/5 my-2 mx-2" />

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  "hover:bg-white/5",
                  isActive && "bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/20",
                  collapsed && "justify-center"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-amber-500 to-orange-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-gold-400" : "text-white/40 group-hover:text-white/60"
                )} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className={cn(
                        "text-sm font-medium whitespace-nowrap overflow-hidden",
                        isActive ? "text-white" : "text-white/60 group-hover:text-white/80"
                      )}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* User info */}
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5",
            collapsed && "justify-center"
          )}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center shrink-0 border border-amber-500/20">
              <User className="h-4 w-4 text-gold-400" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-white/30 truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className={cn(
              "w-full text-white/60 hover:text-white hover:bg-white/10 rounded-xl",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
            title={`Theme: ${theme}`}
          >
            {theme === "system" ? (
              <Monitor className="h-4 w-4 shrink-0" />
            ) : resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4 shrink-0" />
            ) : (
              <Sun className="h-4 w-4 shrink-0" />
            )}
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 whitespace-nowrap overflow-hidden"
                >
                  {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "w-full text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-white/10 bg-navy-800 shadow-md hover:bg-navy-700 text-white/60 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </motion.aside>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed left-4 top-4 z-30 lg:hidden bg-navy-800 border-white/10 text-white hover:bg-navy-700",
          !collapsed && "hidden"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}
