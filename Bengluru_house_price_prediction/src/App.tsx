import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EstimatePricePage from "./pages/EstimatePricePage";
import ComparisonPage from "./pages/ComparisonPage";
import MapPage from "./pages/MapPage";
import NearbyAmenitiesPage from "./pages/NearbyAmenitiesPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { DebugLocationsPage } from "./pages/DebugLocationsPage";
import SimpleEstimateTestPage from "./pages/SimpleEstimateTestPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import ROIAnalyzerPage from "./pages/ROIAnalyzerPage";
import DataHealthPage from "./pages/DataHealthPage";

const queryClient = new QueryClient();

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("React Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", fontFamily: "monospace" }}>
          <h1>App Error</h1>
          <p>{this.state.error?.message}</p>
          <details>
            <summary>Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  console.log("App component: Rendering...");
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/test" element={<TestPage />} />
                <Route path="/simple-estimate-test" element={<SimpleEstimateTestPage />} />
                <Route path="/debug-locations" element={<DebugLocationsPage />} />
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/estimate-price" element={<ProtectedRoute><EstimatePricePage /></ProtectedRoute>} />
                <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/nearby-amenities" element={<ProtectedRoute><NearbyAmenitiesPage /></ProtectedRoute>} />
                <Route path="/data-health" element={<ProtectedRoute><DataHealthPage /></ProtectedRoute>} />
                <Route path="/emi-calculator" element={<ProtectedRoute><EMICalculatorPage /></ProtectedRoute>} />
                <Route path="/roi-analyzer" element={<ProtectedRoute><ROIAnalyzerPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
