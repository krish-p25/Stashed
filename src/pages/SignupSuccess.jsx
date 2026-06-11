import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { C } from "../lib/design";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function SignupSuccess() {
    const [params]   = useSearchParams();
    const navigate   = useNavigate();
    const { loginWithToken } = useAuth();

    const [phase, setPhase] = useState("loading"); // "loading" | "success" | "error"
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = params.get("session_id");
        if (!sessionId) {
            setError("No session found. If you completed payment, please contact support.");
            setPhase("error");
            return;
        }

        async function activate() {
            try {
                const res  = await fetch(`${API}/api/auth/activate`, {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ sessionId }),
                });
                const json = await res.json();
                if (!json.ok) throw new Error(json.error || "Activation failed.");
                loginWithToken(json.token, json.user);
                setPhase("success");
                setTimeout(() => navigate("/dashboard"), 2500);
            } catch (err) {
                setError(err.message || "Something went wrong. Please contact support.");
                setPhase("error");
            }
        }

        activate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen">
            <Glow />
            <Header />
            <div className="pt-24 sm:pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-96px)]">
                <div className="mx-auto max-w-sm px-4 w-full">
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm p-8 shadow-sm text-center space-y-4">
                        {phase === "loading" && (
                            <>
                                <div className="flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                                </div>
                                <p className="text-sm font-medium text-zinc-700">Setting up your account…</p>
                                <p className="text-xs text-zinc-400">This only takes a moment.</p>
                            </>
                        )}

                        {phase === "success" && (
                            <>
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mx-auto">
                                    <svg className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ fontFamily: C.display, fontSize: "22px", fontWeight: 900, color: C.text }}>Welcome to Stashed!</p>
                                    <p className="mt-1 text-sm text-zinc-500">Your account is ready. Taking you to your dashboard…</p>
                                </div>
                                <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full animate-[grow_2.5s_ease-in-out_forwards]" style={{ width: "0%" }} />
                                </div>
                            </>
                        )}

                        {phase === "error" && (
                            <>
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 mx-auto">
                                    <svg className="h-7 w-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-zinc-900">Something went wrong</p>
                                    <p className="mt-1 text-sm text-zinc-500">{error}</p>
                                </div>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                                >
                                    Contact support
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
