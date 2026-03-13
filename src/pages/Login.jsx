import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

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
            if (!email || !password) throw new Error("Please enter your email and password.");
            setStatus({ type: "success", message: "Logged in (stub). API wiring next." });
        } catch (err) {
            setStatus({ type: "error", message: err?.message || "Login failed." });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const t = setTimeout(() => {
            const emailEl = document.querySelector('input[type="email"]');
            const passEl  = document.querySelector('input[type="password"]');
            if (emailEl?.value) setEmail(emailEl.value);
            if (passEl?.value)  setPassword(passEl.value);
        }, 50);
        return () => clearTimeout(t);
    }, []);

    const inputClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-colors";

    return (
        <div className="min-h-screen text-zinc-900">
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
                                            className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                                            onClick={() => setStatus({ type: "info", message: "Password reset flow coming soon." })}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={syncPassword}
                                        onInput={syncPassword}
                                        placeholder="••••••••"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <label className="flex items-center gap-2 text-sm text-zinc-700">
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                            className="h-4 w-4 rounded border-zinc-300 accent-violet-600"
                                        />
                                        Remember me
                                    </label>
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
                                            ? "bg-violet-600 text-white hover:bg-violet-700"
                                            : "bg-zinc-100 text-zinc-500 cursor-not-allowed",
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
