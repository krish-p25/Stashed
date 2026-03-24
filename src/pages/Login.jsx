import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow   from "../components/Glow";
import { useAuth } from "../context/AuthContext";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export default function Login() {
    const [email,       setEmail]       = useState("");
    const [password,    setPassword]    = useState("");
    const [showPass,    setShowPass]    = useState(false);
    const [status,      setStatus]      = useState({ type: "", message: "" });
    const [loading,     setLoading]     = useState(false);
    const [fadingOut,   setFadingOut]   = useState(false);

    const auth           = useAuth();
    const navigate       = useNavigate();
    const [searchParams] = useSearchParams();

    const isReady = email.trim() !== "" && password.trim() !== "";

    function syncEmail(e) {
        setEmail(e.target.value);
        if (status.message) setStatus({ type: "", message: "" });
    }

    function syncPassword(e) {
        setPassword(e.target.value);
        if (status.message) setStatus({ type: "", message: "" });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({ type: "", message: "" });
        setLoading(true);

        try {
            await auth.login(email, password);
            setFadingOut(true);
            setTimeout(() => navigate(searchParams.get("next") || "/dashboard"), 300);
        } catch (err) {
            setStatus({ type: "error", message: err?.message || "Login failed." });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const t = setTimeout(() => {
            const emailEl = document.querySelector('input[autocomplete="email"]');
            const passEl  = document.querySelector('input[autocomplete="current-password"]');
            if (emailEl?.value) setEmail(emailEl.value);
            if (passEl?.value)  setPassword(passEl.value);
        }, 50);
        return () => clearTimeout(t);
    }, []);

    const inputClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-colors";

    return (
        <div className={`min-h-screen text-zinc-900 transition-opacity duration-300 ${fadingOut ? "opacity-0" : "opacity-100"}`}>
            <Glow />
            <Header />

            <main className="pt-24 pb-16 sm:pt-28">
                <Container>
                    <div className="mx-auto max-w-xl">
                        <div className="rounded-2xl border border-violet-200/70 bg-white p-6 sm:p-8 shadow-md shadow-violet-100/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">Early access</p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Log in</h1>
                                </div>
                                <div className="hidden sm:block rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-600 whitespace-nowrap">
                                    Members only
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-zinc-600 leading-6">
                                If you've been granted early access, use your credentials to sign in.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="text-sm text-zinc-700">Email</label>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={syncEmail}
                                        onInput={syncEmail}
                                        placeholder="you@company.com"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-zinc-700">Password</label>
                                        <button
                                            type="button"
                                            className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                                            onClick={() => setStatus({ type: "info", message: "Password reset flow coming soon." })}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative mt-2">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={syncPassword}
                                            onInput={syncPassword}
                                            placeholder="••••••••"
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-11 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(v => !v)}
                                            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                                            aria-label={showPass ? "Hide password" : "Show password"}
                                        >
                                            {showPass ? (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <Link to="/contact" className="text-sm text-violet-600 hover:text-violet-700 transition-colors">
                                        Need access?
                                    </Link>
                                </div>

                                {status.message ? (
                                    <div
                                        className={[
                                            "rounded-xl border px-4 py-3 text-sm",
                                            status.type === "success"
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : status.type === "info"
                                                    ? "border-sky-200 bg-sky-50 text-sky-700"
                                                    : "border-rose-200 bg-rose-50 text-rose-700",
                                        ].join(" ")}
                                    >
                                        {status.message}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={!isReady || loading}
                                    className={[
                                        "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                                        isReady && !loading
                                            ? "cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
                                            : "cursor-not-allowed bg-zinc-100 text-zinc-500",
                                    ].join(" ")}
                                >
                                    {loading ? "Signing in…" : "Sign in"}
                                </button>

                                <p className="text-xs text-zinc-500 leading-5">
                                    By signing in you agree to keep early access features confidential while we iterate.
                                </p>
                            </form>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
