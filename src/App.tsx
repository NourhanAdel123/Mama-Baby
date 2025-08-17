import React, { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import PregnancyWeeks from "./pages/PregnancyWeeks";
import VaccinationSchedule from "./pages/VaccinationScheduale";
import ActivityLog from "./pages/ActivityLog";
import Consultation from "./pages/Consultation";
import HealthTips from "./pages/HealthTips";
import BabyDevelopment from "./pages/BabyDevelopment";
import { supabase } from "./integration/supabase/client";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

const router = createBrowserRouter([
  { path: "/auth", element: <Auth /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pregnancy-weeks",
    element: (
      <ProtectedRoute>
        <PregnancyWeeks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vaccination-schedule",
    element: (
      <ProtectedRoute>
        <VaccinationSchedule />
      </ProtectedRoute>
    ),
  },
  {
    path: "/activity-log",
    element: (
      <ProtectedRoute>
        <ActivityLog />
      </ProtectedRoute>
    ),
  },
  {
    path: "/consultation",
    element: (
      <ProtectedRoute>
        <Consultation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/health-tips",
    element: (
      <ProtectedRoute>
        <HealthTips />
      </ProtectedRoute>
    ),
  },
  {
    path: "/baby-development",
    element: (
      <ProtectedRoute>
        <BabyDevelopment />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
