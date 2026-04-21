import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { C } from "../lib/design";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useSEO } from "../hooks/useSEO";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const STEPS = ["details", "usecase", "plan", "checkout"];

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

// ── Animated reveal (height + fade) ──────────────────────────────────────────
// Uses CSS grid trick: grid-rows-[0fr]→[1fr] collapses/expands without knowing height.
function Reveal({ show, children }) {
    return (
        <div className={`grid transition-all duration-300 ${show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}

// ── Password strength ─────────────────────────────────────────────────────────
const PASSWORD_CRITERIA = [
    { id: "length",    label: "At least 8 characters",  test: p => p.length >= 8 },
    { id: "lowercase", label: "One lowercase letter",   test: p => /[a-z]/.test(p) },
    { id: "uppercase", label: "One uppercase letter",   test: p => /[A-Z]/.test(p) },
    { id: "number",    label: "One number",             test: p => /[0-9]/.test(p) },
    { id: "special",   label: "One special character",  test: p => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_META = [
    null,
    { label: "Weak",    bar: "bg-rose-400",    text: "text-rose-500"    },
    { label: "Fair",    bar: "bg-orange-400",  text: "text-orange-500"  },
    { label: "Good",    bar: "bg-yellow-400",  text: "text-yellow-600"  },
    { label: "Strong",  bar: "bg-lime-500",    text: "text-lime-600"    },
    { label: "Strong",  bar: "bg-emerald-500", text: "text-emerald-600" },
];

function CriterionRow({ met, label }) {
    return (
        <div className={`flex items-center gap-2 transition-colors duration-300 ${met ? "text-emerald-600" : "text-zinc-400"}`}>
            {/* Icon: crossfade between hollow circle and filled checkmark */}
            <div className="relative h-3.5 w-3.5 shrink-0">
                <svg className={`absolute inset-0 transition-all duration-200 ${met ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
                     viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <svg className={`absolute inset-0 transition-all duration-200 ${met ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                     viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="currentColor" opacity="0.15" />
                    <path d="M3.5 7L6 9.5L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="text-xs transition-colors duration-300">{label}</span>
        </div>
    );
}

function PasswordStrength({ password }) {
    const score = PASSWORD_CRITERIA.filter(c => c.test(password)).length;
    const meta  = STRENGTH_META[score];
    return (
        <div className="space-y-2 pt-1.5">
            <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                    {PASSWORD_CRITERIA.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? meta.bar : "bg-zinc-200"}`} />
                    ))}
                </div>
                <Reveal show={score > 0}>
                    <span className={`text-xs font-medium pl-1 transition-colors duration-300 ${meta?.text ?? ""}`}>
                        {meta?.label}
                    </span>
                </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {PASSWORD_CRITERIA.map(({ id, label, test }) => (
                    <CriterionRow key={id} met={test(password)} label={label} />
                ))}
            </div>
        </div>
    );
}

// ── Inline status icon (check / cross / spinner) ─────────────────────────────
function StatusIcon({ status }) {
    if (status === "checking") return (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-500 animate-spin block" />
    );
    if (status === "available" || status === "match") return (
        <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
    if (status === "taken" || status === "mismatch") return (
        <svg className="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
    return null;
}

function fieldBorderCls(status) {
    if (status === "taken"     || status === "mismatch") return "border-rose-300    focus:border-rose-400    focus:ring-rose-200";
    if (status === "available" || status === "match")    return "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100";
    return "";
}

// ── Step 1: Details ───────────────────────────────────────────────────────────
function DetailsStep({ form, setForm, onNext }) {
    const [error,        setError]        = useState(null);
    const [showPass,     setShowPass]     = useState(false);
    // "idle" | "checking" | "available" | "taken"
    const [userStatus,   setUserStatus]   = useState("idle");
    const [emailStatus,  setEmailStatus]  = useState("idle");
    const [suggestions,  setSuggestions]  = useState([]);
    const userDebounce  = useRef(null);
    const emailDebounce = useRef(null);

    // Debounced username check
    useEffect(() => {
        const username = form.username.trim();
        const valid    = username.length >= 3 && username.length <= 32;
        clearTimeout(userDebounce.current);
        userDebounce.current = setTimeout(async () => {
            if (!valid) { setUserStatus("idle"); setSuggestions([]); return; }
            setUserStatus("checking");
            try {
                const res  = await fetch(`${API}/api/auth/check-username?username=${encodeURIComponent(username)}`);
                const json = await res.json();
                if (json.available) { setUserStatus("available"); setSuggestions([]); }
                else                { setUserStatus("taken");     setSuggestions(json.suggestions ?? []); }
            } catch { setUserStatus("idle"); }
        }, valid ? 500 : 0);
        return () => clearTimeout(userDebounce.current);
    }, [form.username]);

    // Debounced email check
    useEffect(() => {
        const email = form.email.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        clearTimeout(emailDebounce.current);
        emailDebounce.current = setTimeout(async () => {
            if (!valid) { setEmailStatus("idle"); return; }
            setEmailStatus("checking");
            try {
                const res  = await fetch(`${API}/api/auth/check-email?email=${encodeURIComponent(email)}`);
                const json = await res.json();
                setEmailStatus(json.available ? "available" : "taken");
            } catch { setEmailStatus("idle"); }
        }, valid ? 500 : 0);
        return () => clearTimeout(emailDebounce.current);
    }, [form.email]);

    // Derived validity — drives button style and blocks handleNext
    const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
    const confirmStatus  = form.confirmPassword.length === 0 ? "idle"
                         : passwordsMatch ? "match" : "mismatch";

    const isFormValid = (
        userStatus  === "available" &&
        emailStatus === "available" &&
        form.password.length >= 8   &&
        passwordsMatch
    );

    function validate() {
        if (!form.username.trim() || form.username.trim().length < 3) return "Username must be at least 3 characters.";
        if (form.username.trim().length > 32) return "Username must be 32 characters or fewer.";
        if (userStatus  === "taken")     return "This username is already taken.";
        if (userStatus  === "checking")  return "Please wait — checking username.";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
        if (emailStatus === "taken")     return "An account with this email already exists.";
        if (emailStatus === "checking")  return "Please wait — checking email.";
        if (form.password.length < 8)   return "Password must be at least 8 characters.";
        if (!passwordsMatch)             return "Passwords do not match.";
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
                <h1 style={{ fontFamily: C.display, fontSize: "26px", fontWeight: 900, color: C.text, lineHeight: 1.1 }}>Create your account</h1>
                <p className="mt-1 text-sm text-zinc-500">Get started in under a minute.</p>
                <Reveal show={!!error}>
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 mt-4">
                        {error}
                    </div>
                </Reveal>
            </div>

            <StepBar step="details" />

            <div className="space-y-3">
                {/* Username */}
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Username</label>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={form.username}
                            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                            placeholder="yourname"
                            autoComplete="username"
                            autoFocus
                            className={`${inputCls} pr-8 ${fieldBorderCls(userStatus)}`}
                        />
                        <span className="absolute right-3 pointer-events-none">
                            <StatusIcon status={userStatus} />
                        </span>
                    </div>
                    <Reveal show={userStatus === "taken"}>
                        <div className="mt-2 space-y-1.5">
                            <p className="text-xs text-rose-600">That username is taken.</p>
                            {suggestions.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs text-zinc-400">Try:</span>
                                    {suggestions.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, username: s }))}
                                            className="cursor-pointer rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Reveal>
                    <Reveal show={userStatus === "available"}>
                        <p className="mt-1.5 text-xs text-emerald-600">Username is available.</p>
                    </Reveal>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Email</label>
                    <div className="relative flex items-center">
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={`${inputCls} pr-8 ${fieldBorderCls(emailStatus)}`}
                        />
                        <span className="absolute right-3 pointer-events-none">
                            <StatusIcon status={emailStatus} />
                        </span>
                    </div>
                    <Reveal show={emailStatus === "taken"}>
                        <p className="mt-1.5 text-xs text-rose-600">An account with this email already exists.</p>
                    </Reveal>
                </div>

                {/* Password + strength meter */}
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
                    <Reveal show={form.password.length > 0}>
                        <PasswordStrength password={form.password} />
                    </Reveal>
                </div>

                {/* Confirm password */}
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Confirm password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPass ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            onKeyDown={e => e.key === "Enter" && isFormValid && handleNext()}
                            className={`${inputCls} pr-8 ${fieldBorderCls(confirmStatus)}`}
                        />
                        <span className="absolute right-3 pointer-events-none">
                            <StatusIcon status={confirmStatus} />
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!isFormValid}
                className={`w-full rounded-2xl py-3 text-sm font-semibold text-white transition-all duration-300 ${
                    isFormValid
                        ? "cursor-pointer bg-violet-600 hover:bg-violet-700 shadow-sm"
                        : "cursor-not-allowed bg-zinc-300"
                }`}
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
                <h1 style={{ fontFamily: C.display, fontSize: "26px", fontWeight: 900, color: C.text, lineHeight: 1.1 }}>Tell us about your events</h1>
                <p className="mt-1 text-sm text-zinc-500">Help us personalise your experience.</p>
            </div>

            <StepBar step="usecase" />

            <Reveal show={!!error}>
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 -mt-2 mb-1">
                    {error}
                </div>
            </Reveal>

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
function PlanStep({ form, onBack, onProceed }) {
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
            onProceed(json.clientSecret);
        } catch {
            setError("Could not connect. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 style={{ fontFamily: C.display, fontSize: "26px", fontWeight: 900, color: C.text, lineHeight: 1.1 }}>You're one step away</h1>
                <p className="mt-1 text-sm text-zinc-500">Complete your payment to unlock Stashed.</p>
            </div>

            <StepBar step="plan" />

            <Reveal show={!!error}>
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 -mt-2 mb-1">
                    {error}
                </div>
            </Reveal>

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
                            Loading…
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

// ── Step 4: Embedded checkout ─────────────────────────────────────────────────
function CheckoutStep({ clientSecret, onBack }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="cursor-pointer flex-none rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                    ← Back
                </button>
                <div>
                    <h1 style={{ fontFamily: C.display, fontSize: "22px", fontWeight: 900, color: C.text, lineHeight: 1.1 }}>Complete your payment</h1>
                    <p className="text-xs text-zinc-500">Secured by Stripe</p>
                </div>
            </div>

            <StepBar step="checkout" />

            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
}

// ── Main Signup component ─────────────────────────────────────────────────────
export default function Signup() {
    useSEO({
        title: "Sign Up — Start Collecting Event Photos & Videos",
        description: "Create your Stashed account and start collecting photos and videos from your event guests in minutes. No app required for guests — just a QR code or link.",
        canonical: "/signup",
    });
    const [step,         setStep]         = useState("details");
    const [visible,      setVisible]      = useState(true);
    const [clientSecret, setClientSecret] = useState(null);
    const [form,         setForm]         = useState({
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

    function handleProceedToCheckout(secret) {
        setClientSecret(secret);
        transitionTo("checkout");
    }

    const isCheckout = step === "checkout";

    return (
        <div className="min-h-screen">
            <Glow />
            <Header />
            <div className={`pt-24 sm:pt-28 pb-16 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                <div className={`mx-auto px-4 transition-all duration-500 ${isCheckout ? "max-w-2xl" : "max-w-md"}`}>
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
                                onProceed={handleProceedToCheckout}
                            />
                        )}
                        {step === "checkout" && (
                            <CheckoutStep
                                clientSecret={clientSecret}
                                onBack={() => transitionTo("plan")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
