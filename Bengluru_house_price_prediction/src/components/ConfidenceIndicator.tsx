import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface ConfidenceIndicatorProps {
  confidence: "HIGH" | "MEDIUM" | "LOW";
  message?: string;
  dataPoints: number;
}

export function ConfidenceIndicator({
  confidence,
  message,
  dataPoints,
}: ConfidenceIndicatorProps) {
  const getStyles = () => {
    switch (confidence) {
      case "HIGH":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          badge: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "High Confidence",
          description:
            "Good model accuracy with sufficient training data",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          badge: "bg-yellow-100 text-yellow-800",
          icon: AlertTriangle,
          label: "Medium Confidence",
          description: "Moderate accuracy - limited data available",
        };
      case "LOW":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          badge: "bg-orange-100 text-orange-800",
          icon: AlertCircle,
          label: "Low Confidence",
          description:
            "Limited data - prediction may be less accurate",
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div className={`border rounded-lg p-4 ${styles.bg} ${styles.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-semibold px-2 py-1 rounded ${styles.badge}`}>
                {styles.label}
              </span>
            </div>
            <p className="text-sm text-gray-600">{styles.description}</p>
            {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Based on {dataPoints} property records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
