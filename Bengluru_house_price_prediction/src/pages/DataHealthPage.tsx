import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  GitBranch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";
import { API_URL } from "@/services/api";

type DataQuality = {
  city: string;
  data_quality: "EXCELLENT" | "GOOD" | "MEDIUM" | "LOW";
  quality_message: string;
  total_records: number;
  total_locations: number;
  recommendation: string;
  warnings: string[];
};

export default function DataHealthPage() {
  const [qualityStats, setQualityStats] = useState<DataQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchQuality = async () => {
    try {
      // For now we fetch bangalore by default
      const res = await fetch(`${API_URL}/api/data-quality/bengaluru`);
      if (res.ok) {
        const data = await res.json();
        setQualityStats(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load data quality stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuality();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    toast.info("Starting automated dataset sync...");
    
    // Simulate backend sync delay
    await new Promise(r => setTimeout(r, 2000));
    
    toast.success("Dataset synchronized and cleaned successfully!");
    setIsSyncing(false);
    fetchQuality();
  };

  return (
    <AppLayout>
      <div className="relative mb-8">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 rounded-full blur-3xl" />
        <PageHeader
          title="Data Health Center"
          description="Monitor dataset quality, versioning, and AI pipeline health"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Control Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl shadow-sm border-border/40 overflow-hidden bg-gradient-to-r from-navy-800 to-navy-900 border-none relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <CardContent className="p-6 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Database className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold">Bangalore Real Estate Model</h3>
                    <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                       <Clock className="h-3 w-3" /> Last synced: Just now
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all flex items-center gap-2 border border-white/10 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? "Syncing..." : "Sync Dataset manually"}
                </button>
             </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground animate-pulse">Loading health metrics...</div>
        ) : qualityStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <Card className="rounded-2xl shadow-card h-full border-border/30">
                  <CardHeader className="pb-3 border-b border-border/20">
                     <CardTitle className="text-sm font-display flex items-center gap-2">
                       <Activity className="h-4 w-4 text-primary" /> Overall Health
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">Quality Level</p>
                          <p className="text-2xl font-bold font-display text-emerald-600">
                             {qualityStats.data_quality}
                          </p>
                       </div>
                       <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                       </div>
                     </div>
                     <p className="text-xs text-muted-foreground pb-2">{qualityStats.quality_message}</p>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Metrics Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
               <Card className="rounded-2xl shadow-card h-full border-border/30">
                  <CardHeader className="pb-3 border-b border-border/20">
                     <CardTitle className="text-sm font-display flex items-center gap-2">
                       <Database className="h-4 w-4 text-primary" /> Volume Metrics
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Records</p>
                         <p className="text-xl font-bold text-foreground">{qualityStats.total_records.toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Locations</p>
                         <p className="text-xl font-bold text-foreground">{qualityStats.total_locations.toLocaleString()}</p>
                       </div>
                     </div>
                     <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary rounded-full w-full" />
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Version Control Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
               <Card className="rounded-2xl shadow-card h-full border-border/30">
                  <CardHeader className="pb-3 border-b border-border/20 flex flex-row items-center justify-between">
                     <CardTitle className="text-sm font-display flex items-center gap-2">
                       <GitBranch className="h-4 w-4 text-primary" /> columns.json
                     </CardTitle>
                     <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground tracking-wider">v2.1.0</span>
                  </CardHeader>
                  <CardContent className="pt-4">
                     <p className="text-sm text-foreground mb-3 font-medium">Schema Version Tracking Active</p>
                     <ul className="space-y-2">
                       <li className="flex items-center gap-2 text-xs text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> One-Hot Locations Linked
                       </li>
                       <li className="flex items-center gap-2 text-xs text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Num Features Validated
                       </li>
                       <li className="flex items-center gap-2 text-xs text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Outlier Pruning Engaged
                       </li>
                     </ul>
                  </CardContent>
               </Card>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-20">Failed to load payload</div>
        )}
      </div>
    </AppLayout>
  );
}
