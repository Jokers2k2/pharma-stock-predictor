import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Operations from "./pages/Operations";
import ReceptionPage from "./pages/ReceptionPage";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import TrafficLightPage from "./pages/TrafficLightPage";
import SmartScanPage from "./pages/SmartScanPage";
import FefoPickingPage from "./pages/FefoPickingPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/reception" element={<ReceptionPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
            <Route path="/traffic-light" element={<TrafficLightPage />} />
            <Route path="/smart-scan" element={<SmartScanPage />} />
            <Route path="/fefo-picking" element={<FefoPickingPage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
