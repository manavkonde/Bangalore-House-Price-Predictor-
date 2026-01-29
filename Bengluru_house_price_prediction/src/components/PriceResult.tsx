import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, MapPin, Maximize, BedDouble, Bath } from "lucide-react";

interface PriceResultProps {
  price: number;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
}

export function PriceResult({ price, location, sqft, bhk, bath }: PriceResultProps) {
  const pricePerSqft = price / sqft;
  
  // Format price in Lakhs or Crores
  const formatPrice = (p: number) => {
    if (p >= 100) {
      return `${(p / 100).toFixed(2)} Cr`;
    }
    return `${p.toFixed(2)} L`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-gradient-card rounded-2xl p-6 shadow-glow border border-primary/20"
    >
      {/* Main Price */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4"
        >
          <IndianRupee className="h-8 w-8 text-primary-foreground" />
        </motion.div>
        
        <p className="text-sm text-muted-foreground mb-2">Estimated Price</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-display font-bold text-gradient-primary"
        >
          ₹{formatPrice(price)}
        </motion.h2>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 bg-muted/50 rounded-lg p-3"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm capitalize truncate">{location}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 bg-muted/50 rounded-lg p-3"
        >
          <Maximize className="h-4 w-4 text-primary" />
          <span className="text-sm">{sqft.toLocaleString()} sqft</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 bg-muted/50 rounded-lg p-3"
        >
          <BedDouble className="h-4 w-4 text-primary" />
          <span className="text-sm">{bhk} BHK</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 bg-muted/50 rounded-lg p-3"
        >
          <Bath className="h-4 w-4 text-primary" />
          <span className="text-sm">{bath} Bath</span>
        </motion.div>
      </div>

      {/* Price per sqft */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between bg-primary/5 rounded-lg p-4 border border-primary/10"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-secondary" />
          <span className="text-sm text-muted-foreground">Price per sqft</span>
        </div>
        <span className="font-semibold text-foreground">
          ₹{(pricePerSqft * 100000).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
      </motion.div>
    </motion.div>
  );
}
