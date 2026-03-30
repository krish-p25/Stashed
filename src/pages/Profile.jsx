import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useAuth } from "../context/useAuth";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function authHeaders(token) {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Card({ title, children }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-zinc-900">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">{label}</label>
            {children}
        </div>
    );
}

function Input({ type = "text", ...props }) {
    return (
        <input
            type={type}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
            {...props}
        />
    );
}

function Btn({ loading, children, ...props }) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${props.className ?? "bg-violet-600 text-white hover:bg-violet-700"}`}
        >
            {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            {children}
        </button>
    );
}

function Feedback({ msg, ok }) {
    if (!msg) return null;
    return (
        <p className={`text-sm font-medium ${ok ? "text-emerald-600" : "text-rose-500"}`}>{msg}</p>
    );
}

function EyeToggle({ show, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            tabIndex={-1}
        >
            {show ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );
}

// ── Username section ──────────────────────────────────────────────────────────

function UsernameSection({ currentUsername, token, onSaved }) {
    const [value,    setValue]    = useState(currentUsername ?? "");
    const [loading,  setLoading]  = useState(false);
    const [feedback, setFeedback] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);
        try {
            const res  = await fetch(`${API}/api/profile/username`, {
                method:  "PATCH",
                headers: authHeaders(token),
                body:    JSON.stringify({ username: value }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setFeedback({ ok: true, msg: "Username updated." });
            onSaved({ username: data.username });
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Username">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Username">
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="3–32 characters"
                        minLength={3}
                        maxLength={32}
                    />
                </Field>
                <div className="flex items-center gap-3">
                    <Btn loading={loading} type="submit">Save</Btn>
                    <Feedback msg={feedback?.msg} ok={feedback?.ok} />
                </div>
            </form>
        </Card>
    );
}

// ── Email section ─────────────────────────────────────────────────────────────

function EmailSection({ currentEmail, token, onSaved }) {
    const [email,    setEmail]    = useState(currentEmail ?? "");
    const [pass,     setPass]     = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading,  setLoading]  = useState(false);
    const [feedback, setFeedback] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);
        try {
            const res  = await fetch(`${API}/api/profile/email`, {
                method:  "PATCH",
                headers: authHeaders(token),
                body:    JSON.stringify({ email, currentPassword: pass }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setFeedback({ ok: true, msg: "Email updated." });
            setPass("");
            onSaved({ email: data.email });
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Email Address">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="New email">
                    <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </Field>
                <Field label="Current password">
                    <div className="relative">
                        <Input
                            type={showPass ? "text" : "password"}
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            placeholder="Required to confirm"
                            className="pr-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
                        />
                        <EyeToggle show={showPass} onToggle={() => setShowPass(v => !v)} />
                    </div>
                </Field>
                <div className="flex items-center gap-3">
                    <Btn loading={loading} type="submit">Save</Btn>
                    <Feedback msg={feedback?.msg} ok={feedback?.ok} />
                </div>
            </form>
        </Card>
    );
}

// ── Password section ──────────────────────────────────────────────────────────

function PasswordSection({ token }) {
    const [current,     setCurrent]     = useState("");
    const [next,        setNext]        = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext,    setShowNext]    = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [feedback,    setFeedback]    = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (next.length < 8) {
            setFeedback({ ok: false, msg: "New password must be at least 8 characters." });
            return;
        }
        setLoading(true);
        setFeedback(null);
        try {
            const res  = await fetch(`${API}/api/profile/password`, {
                method:  "PATCH",
                headers: authHeaders(token),
                body:    JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setFeedback({ ok: true, msg: "Password updated." });
            setCurrent("");
            setNext("");
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Password">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Current password">
                    <div className="relative">
                        <Input
                            type={showCurrent ? "text" : "password"}
                            value={current}
                            onChange={e => setCurrent(e.target.value)}
                            placeholder="••••••••"
                            className="pr-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
                        />
                        <EyeToggle show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
                    </div>
                </Field>
                <Field label="New password">
                    <div className="relative">
                        <Input
                            type={showNext ? "text" : "password"}
                            value={next}
                            onChange={e => setNext(e.target.value)}
                            placeholder="At least 8 characters"
                            className="pr-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
                        />
                        <EyeToggle show={showNext} onToggle={() => setShowNext(v => !v)} />
                    </div>
                </Field>
                <div className="flex items-center gap-3">
                    <Btn loading={loading} type="submit">Save</Btn>
                    <Feedback msg={feedback?.msg} ok={feedback?.ok} />
                </div>
            </form>
        </Card>
    );
}

// ── Google Drive section ──────────────────────────────────────────────────────

function DriveSection({ connected, token, onChanged }) {
    const [loading,  setLoading]  = useState(false);
    const [feedback, setFeedback] = useState(null);

    async function handleConnect() {
        setLoading(true);
        setFeedback(null);
        try {
            const res  = await fetch(`${API}/api/auth/google-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            window.location.href = data.url;
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
            setLoading(false);
        }
    }

    async function handleDisconnect() {
        setLoading(true);
        setFeedback(null);
        try {
            const res  = await fetch(`${API}/api/profile/google`, {
                method:  "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setFeedback({ ok: true, msg: "Google Drive disconnected." });
            onChanged(false);
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Google Drive">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    {/* Google Drive icon */}
                    <svg className="h-8 w-8 shrink-0" viewBox="0 0 87.3 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                        <path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5C.4 49.9 0 51.45 0 53h27.5z" fill="#00ac47"/>
                        <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.65 10.2z" fill="#ea4335"/>
                        <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.45-4.45 1.2z" fill="#00832d"/>
                        <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684fc"/>
                        <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-zinc-900">
                            {connected ? "Connected" : "Not connected"}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {connected
                                ? "Your Google Drive account is linked. Uploads go directly to your Drive."
                                : "Connect Google Drive to sync event uploads automatically."}
                        </p>
                    </div>
                    <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${connected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-500 border border-zinc-200"}`}>
                        {connected ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {connected ? (
                        <>
                            <Btn loading={loading} onClick={handleConnect} className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                                Switch account
                            </Btn>
                            <Btn loading={loading} onClick={handleDisconnect} className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200">
                                Disconnect
                            </Btn>
                        </>
                    ) : (
                        <Btn loading={loading} onClick={handleConnect}>
                            Connect Google Drive
                        </Btn>
                    )}
                    <Feedback msg={feedback?.msg} ok={feedback?.ok} />
                </div>
            </div>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Profile() {
    const { token, user, updateUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [profile,   setProfile]   = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [driveMsg,  setDriveMsg]  = useState(null);

    // Handle ?drive=connected redirect from Google OAuth
    useEffect(() => {
        const drive = searchParams.get("drive");
        if (drive === "connected") {
            setDriveMsg({ ok: true, msg: "Google Drive connected successfully." });
            setSearchParams({}, { replace: true });
        } else if (drive === "error" || drive === "denied") {
            setDriveMsg({ ok: false, msg: "Google Drive connection failed. Please try again." });
            setSearchParams({}, { replace: true });
        }
    }, []);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res  = await fetch(`${API}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.ok) setProfile(data.user);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [token]);

    function handleSaved(partial) {
        setProfile(prev => ({ ...prev, ...partial }));
        updateUser(partial);
    }

    function handleDriveChanged(connected) {
        setProfile(prev => ({ ...prev, driveConnected: connected }));
    }

    return (
        <div className="relative min-h-screen bg-white">
            <Glow />
            <Header />
            <div className="pt-28 pb-20">
                <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-zinc-900">Profile</h1>
                        <p className="mt-1 text-sm text-zinc-500">Manage your account details and connections.</p>
                    </div>

                    {driveMsg && (
                        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${driveMsg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-600"}`}>
                            {driveMsg.msg}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <svg className="h-6 w-6 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            <UsernameSection
                                currentUsername={profile?.username}
                                token={token}
                                onSaved={handleSaved}
                            />
                            <EmailSection
                                currentEmail={profile?.email}
                                token={token}
                                onSaved={handleSaved}
                            />
                            <PasswordSection token={token} />
                            <DriveSection
                                connected={profile?.driveConnected ?? false}
                                token={token}
                                onChanged={handleDriveChanged}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
