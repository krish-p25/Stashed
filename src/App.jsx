import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home        from "./pages/Home.jsx";
import Features    from "./pages/Features.jsx";
import HowItWorks  from "./pages/HowItWorks.jsx";
import UseCases    from "./pages/UseCases.jsx";
import Contact     from "./pages/Contact.jsx";
import Login       from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/"           element={<Home />} />
                    <Route path="/features"   element={<Features />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/use-cases"  element={<UseCases />} />
                    <Route path="/contact"    element={<Contact />} />
                    <Route path="/login"      element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard"                  element={<Dashboard />} />
                        <Route path="/dashboard/events/new"       element={<CreateEvent />} />
                        <Route path="/dashboard/events/:id"       element={<EventDetail />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
