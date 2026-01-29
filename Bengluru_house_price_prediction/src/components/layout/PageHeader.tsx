import { ChevronLeft } from "lucide-react";
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
    <div className="mb-6">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backTo)}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      )}
      <h1 className="text-2xl md:text-3xl font-display font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
