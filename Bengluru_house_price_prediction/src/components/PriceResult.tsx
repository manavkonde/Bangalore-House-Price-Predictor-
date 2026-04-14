import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingUp,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  History,
  BarChart3,
  Info,
  Award,
  Building2,
  Download,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { generatePredictionPDF } from "@/utils/generatePDF";

interface PriceResultProps {
  price: number;
  city?: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  warning?: string;
  priceRange?: { min: number; max: number; median: number; [key: string]: number };
  dataPoints?: number;
}

export function PriceResult({ 
  price, 
  city, 
  location, 
  sqft, 
  bhk, 
  bath,
  confidence = "HIGH",
  warning,
  priceRange,
  dataPoints = 0
}: PriceResultProps) {
  const pricePerSqft = price / sqft;
  const currentYear = new Date().getFullYear();

  // Format price in Lakhs or Crores
  const formatPrice = (p: number) => {
    if (p >= 100) {
      return `${(p / 100).toFixed(2)} Cr`;
    }
    return `${p.toFixed(2)} L`;
  };

  const chartData = useMemo(() => {
    const data = [];
    const appreciationRate = 0.065;
    const inflationRate = 0.055;

    for (let i = 5; i > 0; i--) {
      const year = currentYear - i;
      const factor = Math.pow(1 + appreciationRate, i);
      const pastPrice = price / factor;
      const realValue = pastPrice * Math.pow(1 + inflationRate, i);
      data.push({
        year: year.toString(),
        price: Number(pastPrice.toFixed(2)),
        realValue: Number(realValue.toFixed(2)),
        isFuture: false
      });
    }

    data.push({
      year: currentYear.toString(),
      price: Number(price.toFixed(2)),
      realValue: Number(price.toFixed(2)),
      isFuture: false
    });

    for (let i = 1; i <= 5; i++) {
      const year = currentYear + i;
      const futurePrice = price * Math.pow(1 + appreciationRate, i);
      const realValue = futurePrice / Math.pow(1 + inflationRate, i);
      data.push({
        year: year.toString(),
        price: Number(futurePrice.toFixed(2)),
        realValue: Number(realValue.toFixed(2)),
        isFuture: true
      });
    }

    return data;
  }, [price, currentYear]);

  const futurePrice5Years = chartData[chartData.length - 1].price;
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      await generatePredictionPDF({
        price,
        city,
        location,
        sqft,
        bhk,
        bath,
        confidence,
        priceRange: priceRange ? { min: priceRange.min, max: priceRange.max, median: priceRange.median } : undefined,
        dataPoints,
      });
      toast.success("PDF report downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF report.");
    }
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      city: city || "",
      location,
      sqft: sqft.toString(),
      bhk: bhk.toString(),
      bath: bath.toString(),
    });
    const shareUrl = `${window.location.origin}/estimate-price?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative rounded-3xl overflow-hidden flex flex-col h-full w-full max-w-xl mx-auto"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-amber-500/30 via-blue-500/10 to-amber-500/20 rounded-3xl" />
      
      <div className="relative bg-white rounded-3xl p-6 shadow-card flex flex-col h-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="trends" className="rounded-lg font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">5Y Futures</TabsTrigger>
            <TabsTrigger value="inflation" className="rounded-lg font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Inflation Adj</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5 mt-0">
            {/* Main Price */}
            <div className="text-center relative">
              {/* Glow effect behind the price */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 mb-4 shadow-lg"
              >
                <IndianRupee className="h-8 w-8 text-gold-400" />
              </motion.div>

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 font-body">
                Estimated Price
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl font-display font-bold text-shimmer tracking-tight relative"
              >
                ₹{formatPrice(price)}
              </motion.h2>
              
              {city && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary capitalize">
                    <Building2 className="h-3 w-3" /> {city}
                  </span>
                </div>
              )}
            </div>

            {/* Confidence Indicator */}
            {confidence && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <ConfidenceIndicator 
                  confidence={confidence}
                  message={warning}
                  dataPoints={dataPoints}
                />
              </motion.div>
            )}

            {/* Price Range Info */}
            {priceRange && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <p className="text-xs font-semibold text-blue-900 mb-2">EXPECTED PRICE RANGE</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted:</span>
                    <span className="font-semibold text-blue-900">₹{(() => {
                      if (price >= 10000000) {
                        return `${(price / 10000000).toFixed(2)} Cr`;
                      }
                      return `${(price / 100000).toFixed(2)} L`;
                    })()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: ₹{(() => {
                      const min = priceRange.min;
                      if (min >= 10000000) {
                        return `${(min / 10000000).toFixed(2)} Cr`;
                      }
                      return `${(min / 100000).toFixed(2)} L`;
                    })()}</span>
                    <span>Max: ₹{(() => {
                      const max = priceRange.max;
                      if (max >= 10000000) {
                        return `${(max / 10000000).toFixed(2)} Cr`;
                      }
                      return `${(max / 100000).toFixed(2)} L`;
                    })()}</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: location, delay: 0.4, dir: "x", dirVal: -20 },
                { icon: Maximize, label: `${sqft.toLocaleString()} sqft`, delay: 0.4, dir: "x", dirVal: 20 },
                { icon: BedDouble, label: `${bhk} BHK`, delay: 0.5, dir: "x", dirVal: -20 },
                { icon: Bath, label: `${bath} Bath`, delay: 0.5, dir: "x", dirVal: 20 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.dirVal }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="flex items-center gap-2.5 bg-muted/30 rounded-xl p-3.5 border border-border/30 hover:border-primary/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm capitalize truncate font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Special Cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-1 rounded-xl p-4 border border-amber-500/10 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600/70">Price/Sqft</span>
                </div>
                <span className="font-display font-bold text-foreground text-lg">
                  ₹{(pricePerSqft * 100000).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-1 rounded-xl p-4 border border-blue-500/10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <History className="h-4 w-4 text-blue-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600/70">5Y Forecast</span>
                </div>
                <span className="font-display font-bold text-foreground text-lg">
                  ₹{formatPrice(futurePrice5Years)}
                </span>
              </motion.div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 text-white text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border/50 text-foreground text-sm font-semibold hover:bg-muted/50 transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Copied!" : "Share"}
                </motion.button>
              </div>
              <div className="flex gap-2 mt-1">
                <Link to={`/emi-calculator?amount=${(price/100000).toFixed(2)}`} className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 transition-all"
                  >
                    <IndianRupee className="h-4 w-4" />
                    EMI Calculator
                  </motion.div>
                </Link>
                <Link to={`/roi-analyzer?amount=${(price/100000).toFixed(2)}`} className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 transition-all"
                  >
                    <TrendingUp className="h-4 w-4" />
                    ROI Analyzer
                  </motion.div>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-2">
              <h3 className="text-lg font-display font-bold flex items-center gap-2 text-foreground">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                10-Year Trajectory
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Historical estimate and 5-year future prediction (+6.5% YoY)</p>
            </div>
            <div className="h-[280px] w-full mt-4 bg-muted/20 rounded-xl p-4 border border-border/30">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 100 ? (val / 100).toFixed(1) + 'C' : val.toFixed(0) + 'L'}`} dx={-10} />
                  <RechartsTooltip
                    formatter={(value: any) => [`₹${formatPrice(Number(value))}`, "Est. Price"]}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '4px' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Inter, sans-serif' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-start gap-2.5 bg-amber-50 p-3.5 rounded-xl text-xs text-muted-foreground border border-amber-200/50">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="leading-relaxed"><strong className="text-foreground">Forecast Note:</strong> Predictions use a standard 6.5% regional appreciation rate model based on past real estate indices. Actual local market shifts may alter values.</p>
            </div>
          </TabsContent>

          <TabsContent value="inflation" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-2">
              <h3 className="text-lg font-display font-bold flex items-center gap-2 text-foreground">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Inflation Impact Analysis
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Comparing market appreciation against inflation (~5.5%)</p>
            </div>
            <div className="h-[280px] w-full mt-4 bg-muted/20 rounded-xl p-4 border border-border/30">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 100 ? (val / 100).toFixed(1) + 'C' : val.toFixed(0) + 'L'}`} dx={-10} />
                  <RechartsTooltip
                    formatter={(value: any, name: string) => [
                      `₹${formatPrice(Number(value))}`,
                      name === 'price' ? 'Nominal Market Price' : 'Real Value (Today\'s ₹)'
                    ]}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '4px' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Inter, sans-serif' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontFamily: 'Inter, sans-serif' }} />
                  <Line type="monotone" dataKey="price" name="Market Price" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="realValue" name="Real Value" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-start gap-2.5 bg-rose-50 p-3.5 rounded-xl text-xs text-muted-foreground border border-rose-200/50">
              <Info className="h-4 w-4 shrink-0 text-rose-500" />
              <p className="leading-relaxed"><strong className="text-foreground">Real Value:</strong> Shows the property's purchasing power assuming 5.5% annual inflation. A flat 'Real Value' line indicates the property is only matching inflation without true capital gain.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
