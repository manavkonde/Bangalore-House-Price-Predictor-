import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocationComparison } from "@/components/LocationComparison";

export default function ComparisonPage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Location Comparison" 
        description="Compare property prices across different Bangalore areas"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LocationComparison />
      </motion.div>
    </AppLayout>
  );
}
