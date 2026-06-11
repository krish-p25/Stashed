import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home        from "./pages/Home.jsx";
import Features    from "./pages/Features.jsx";
import HowItWorks  from "./pages/HowItWorks.jsx";
import UseCases    from "./pages/UseCases.jsx";
import Contact     from "./pages/Contact.jsx";
import Privacy     from "./pages/Privacy.jsx";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import SignupSuccess   from "./pages/SignupSuccess";
import Dashboard   from "./pages/Dashboard";
import Admin       from "./pages/Admin";
import Profile     from "./pages/Profile";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Upload     from "./pages/Upload";
import Gallery    from "./pages/Gallery";

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
                    <Route path="/privacy"    element={<Privacy />} />
                    <Route path="/login"          element={<Login />} />
                    <Route path="/signup"         element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess />} />
                    <Route path="/upload/:userId/:slug"  element={<Upload />} />
                    <Route path="/gallery/:userId/:slug" element={<Gallery />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard"                  element={<Dashboard />} />
                        <Route path="/dashboard/events/new"       element={<CreateEvent />} />
                        <Route path="/dashboard/events/:id"       element={<EventDetail />} />
                        <Route path="/admin"                      element={<Admin />} />
                        <Route path="/profile"                    element={<Profile />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
