import { ChevronLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function PageHeader({ title, description, showBackButton = true, backTo = "/dashboard" }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backTo)}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground group"
        >
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Button>
      )}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">{title}</h1>
      </div>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
