import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Glow   from "../components/Glow";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const STEPS = ["details", "usecase", "plan"];

const EVENT_TYPES = [
    { id: "celebrations", label: "🎊 Celebrations" },
    { id: "weddings",     label: "💒 Weddings"     },
    { id: "birthdays",    label: "🎂 Birthdays"    },
    { id: "corporate",    label: "💼 Corporate"    },
    { id: "graduations",  label: "🎓 Graduations"  },
    { id: "photography",  label: "📸 Photography"  },
    { id: "other",        label: "✨ Other"         },
];

const GUEST_COUNTS = ["Under 20", "20–100", "100–500", "500+"];

const FEATURES = [
    "Unlimited events",
    "Google Drive sync",
    "Guest photo galleries",
    "PIN-protected upload links",
    "Bulk upload support",
    "Image moderation & approval",
];

// ── Eye icons (same as EventDetail) ──────────────────────────────────────────
function EyeOff() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}
function EyeOn() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ step }) {
    const idx = STEPS.indexOf(step);
    return (
        <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
                <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        i < idx  ? "flex-1 bg-violet-400" :
                        i === idx ? "flex-[2] bg-violet-600" :
                                    "flex-1 bg-zinc-200"
                    }`}
                />
            ))}
        </div>
    );
}

// ── Shared input style ────────────────────────────────────────────────────────
const inputCls = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors";

// ── Step 1: Details ───────────────────────────────────────────────────────────
function DetailsStep({ form, setForm, onNext }) {
    const [error,    setError]    = useState(null);
    const [showPass, setShowPass] = useState(false);

    function validate() {
        if (!form.username.trim()) return "Username is required.";
        if (form.username.trim().length < 3) return "Username must be at least 3 characters.";
        if (form.username.trim().length > 32) return "Username must be 32 characters or fewer.";
        if (!form.email.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
        if (!form.password) return "Password is required.";
        if (form.password.length < 8) return "Password must be at least 8 characters.";
        if (form.password !== form.confirmPassword) return "Passwords do not match.";
        return null;
    }

    function handleNext() {
        const err = validate();
        if (err) { setError(err); return; }
        setError(null);
        onNext();
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Create your account</h1>
                <p className="mt-1 text-sm text-zinc-500">Get started in under a minute.</p>
            </div>

            <StepBar step="details" />

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Username</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        placeholder="yourname"
                        autoComplete="username"
                        autoFocus
                        className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPass ? "text" : "password"}
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="8+ characters"
                            autoComplete="new-password"
                            className={`${inputCls} pr-10`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(v => !v)}
                            className="absolute right-3 cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPass ? <EyeOff /> : <EyeOn />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Confirm password</label>
                    <input
                        type={showPass ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        onKeyDown={e => e.key === "Enter" && handleNext()}
                        className={inputCls}
                    />
                </div>
            </div>

            <button
                onClick={handleNext}
                className="w-full cursor-pointer rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
                Continue →
            </button>

            <p className="text-center text-xs text-zinc-400">
                Already have an account?{" "}
                <Link to="/login" className="text-violet-600 hover:underline font-medium">Log in</Link>
            </p>
        </div>
    );
}

// ── Step 2: Use case ──────────────────────────────────────────────────────────
function UseCaseStep({ form, setForm, onNext, onBack }) {
    const [error, setError] = useState(null);

    function toggleEventType(id) {
        setForm(f => ({
            ...f,
            eventTypes: f.eventTypes.includes(id)
                ? f.eventTypes.filter(t => t !== id)
                : [...f.eventTypes, id],
        }));
    }

    function handleNext() {
        if (form.eventTypes.length === 0) { setError("Select at least one event type."); return; }
        if (!form.guestCount) { setError("Select your typical guest count."); return; }
        setError(null);
        onNext();
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Tell us about your events</h1>
                <p className="mt-1 text-sm text-zinc-500">Help us personalise your experience.</p>
            </div>

            <StepBar step="usecase" />

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-zinc-700 mb-2.5">What kinds of events do you capture?</p>
                    <div className="flex flex-wrap gap-2">
                        {EVENT_TYPES.map(({ id, label }) => {
                            const active = form.eventTypes.includes(id);
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => toggleEventType(id)}
                                    className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                                        active
                                            ? "border-violet-400 bg-violet-50 text-violet-700 shadow-[0_0_0_2px_rgba(139,92,246,0.15)]"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-zinc-700 mb-2.5">How many guests typically attend?</p>
                    <div className="flex flex-wrap gap-2">
                        {GUEST_COUNTS.map(count => {
                            const active = form.guestCount === count;
                            return (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, guestCount: count }))}
                                    className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                                        active
                                            ? "border-violet-400 bg-violet-50 text-violet-700 shadow-[0_0_0_2px_rgba(139,92,246,0.15)]"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                                    }`}
                                >
                                    {count}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex gap-2.5">
                <button
                    onClick={onBack}
                    className="cursor-pointer flex-none rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="cursor-pointer flex-1 rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// ── Step 3: Plan ──────────────────────────────────────────────────────────────
function PlanStep({ form, onBack }) {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    async function handleCheckout() {
        setLoading(true);
        setError(null);
        try {
            const res  = await fetch(`${API}/api/auth/checkout`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    username:    form.username.trim(),
                    email:       form.email.trim(),
                    password:    form.password,
                    useCaseType: form.eventTypes.join(","),
                    guestCount:  form.guestCount,
                }),
            });
            const json = await res.json();
            if (!json.ok) { setError(json.error || "Something went wrong."); setLoading(false); return; }
            window.location.href = json.url;
        } catch {
            setError("Could not connect. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">You're one step away</h1>
                <p className="mt-1 text-sm text-zinc-500">Complete your payment to unlock Stashed.</p>
            </div>

            <StepBar step="plan" />

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {/* Plan card */}
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-base font-semibold text-zinc-900">Stashed — Full Access</p>
                        <p className="text-xs text-zinc-500 mt-0.5">One account, every feature, forever.</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-violet-700">
                            {import.meta.env.VITE_PRICE_DISPLAY || "$9"}
                        </p>
                        <p className="text-xs text-zinc-400">
                            {import.meta.env.VITE_PRICE_PERIOD || "one-time"}
                        </p>
                    </div>
                </div>

                <ul className="space-y-2">
                    {FEATURES.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-700">
                            <svg className="h-4 w-4 shrink-0 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Paying as */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs text-zinc-600">
                    Paying as <span className="font-medium">{form.email}</span>
                </p>
            </div>

            <div className="flex gap-2.5">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="cursor-pointer flex-none rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                    ← Back
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Redirecting…
                        </>
                    ) : (
                        <>
                            Continue to payment
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-zinc-400">
                Payments processed securely by{" "}
                <span className="font-medium text-zinc-600">Stripe</span>
            </p>
        </div>
    );
}

// ── Main Signup component ─────────────────────────────────────────────────────
export default function Signup() {
    const [step,    setStep]    = useState("details");
    const [visible, setVisible] = useState(true);
    const [form,    setForm]    = useState({
        username:        "",
        email:           "",
        password:        "",
        confirmPassword: "",
        eventTypes:      [],
        guestCount:      "",
    });

    const transitionTo = useCallback((newStep) => {
        const needsScroll = window.scrollY > 0;
        if (needsScroll) window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                setStep(newStep);
                requestAnimationFrame(() => setVisible(true));
            }, 500);
        }, needsScroll ? 400 : 0);
    }, []);

    return (
        <div className="min-h-screen">
            <Glow />
            <Header />
            <div className={`pt-24 sm:pt-28 pb-16 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                <div className="mx-auto max-w-md px-4">
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
                        {step === "details" && (
                            <DetailsStep
                                form={form}
                                setForm={setForm}
                                onNext={() => transitionTo("usecase")}
                            />
                        )}
                        {step === "usecase" && (
                            <UseCaseStep
                                form={form}
                                setForm={setForm}
                                onNext={() => transitionTo("plan")}
                                onBack={() => transitionTo("details")}
                            />
                        )}
                        {step === "plan" && (
                            <PlanStep
                                form={form}
                                onBack={() => transitionTo("usecase")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
