import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
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
            // TODO: wire to your API later:
            // const res = await fetch("/api/auth/login", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ email, password, remember }),
            // });
            // if (!res.ok) throw new Error("Invalid login.");
            // const data = await res.json();

            // For now, stub success if both fields filled
            if (!email || !password) throw new Error("Please enter your email and password.");

            setStatus({ type: "success", message: "Logged in (stub). API wiring next." });
        } catch (err) {
            setStatus({ type: "error", message: err?.message || "Login failed." });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // catches browser/password-manager autofill on page load
        const t = setTimeout(() => {
            const emailEl = document.querySelector('input[type="email"]');
            const passEl = document.querySelector('input[type="password"]');
            if (emailEl?.value) setEmail(emailEl.value);
            if (passEl?.value) setPassword(passEl.value);
        }, 50);

        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Glow />
            <Header />

            <main className="pt-10 pb-16 sm:pt-14">
                <Container>
                    <div className="mx-auto max-w-xl">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-white/60">Early access</p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Log in</h1>
                                    
                                </div>
                                <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 whitespace-nowrap">
                                    Members only
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-white/70 leading-6 w-full">
                                If you’ve been granted early access, use your credentials to sign in.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="text-sm text-white/70">Email</label>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={syncEmail}
                                        onInput={syncEmail}
                                        placeholder="you@company.com"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-white/70">Password</label>
                                        <button
                                            type="button"
                                            className="text-xs text-white/60 hover:text-white/80"
                                            onClick={() =>
                                                setStatus({ type: "info", message: "Password reset flow coming soon." })
                                            }
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
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <label className="flex items-center gap-2 text-sm text-white/70">
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                            className="h-4 w-4 rounded border-white/20 bg-white/5"
                                        />
                                        Remember me
                                    </label>

                                    <Link to="/contact" className="text-sm text-white/60 hover:text-white/80">
                                        Need access?
                                    </Link>
                                </div>

                                {status.message ? (
                                    <div
                                        className={[
                                            "rounded-xl border px-4 py-3 text-sm",
                                            status.type === "success"
                                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                                                : status.type === "info"
                                                    ? "border-sky-500/20 bg-sky-500/10 text-sky-200"
                                                    : "border-rose-500/20 bg-rose-500/10 text-rose-200",
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
                                            ? "bg-white text-zinc-950 hover:bg-white/90"
                                            : "bg-white/10 text-white/40 cursor-not-allowed hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    {loading ? "Signing in…" : "Sign in"}
                                </button>


                                <p className="text-xs text-white/50 leading-5">
                                    By signing in you agree to keep early access features confidential while we iterate.
                                </p>
                            </form>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
