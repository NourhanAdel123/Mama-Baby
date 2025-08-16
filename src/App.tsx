import React from "react";
import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import PregnancyWeeks from "./pages/PregnancyWeeks";
import VaccinationSchedule from "./pages/VaccinationScheduale";
import ActivityLog from "./pages/ActivityLog";
import Consultation from "./pages/Consultation";
import HealthTips from "./pages/HealthTips";
import BabyDevelopment from "./pages/BabyDevelopment";

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/settings", element: <Settings /> },
  { path: "/pregnancy-weeks", element: <PregnancyWeeks /> },
  { path: "/vaccination-schedule", element: <VaccinationSchedule /> },
  { path: "/activity-log", element: <ActivityLog /> },
  { path: "/consultation", element: <Consultation /> },
  { path: "/health-tips", element: <HealthTips /> },
  { path: "/baby-development", element: <BabyDevelopment /> },
]);

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
