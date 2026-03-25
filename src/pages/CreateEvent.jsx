import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 60);
}

function Container({ children }) {
    return <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export default function CreateEvent() {
    const auth     = useAuth();
    const navigate = useNavigate();

    const [title,       setTitle]       = useState("");
    const [slug,        setSlug]        = useState("");
    const [slugEdited,  setSlugEdited]  = useState(false);
    const [description, setDescription] = useState("");
    const [pinEnabled,  setPinEnabled]  = useState(false);
    const [pin,         setPin]         = useState("");
    const [showPin,     setShowPin]     = useState(false);
    const [submitting,    setSubmitting]    = useState(false);
    const [error,         setError]         = useState(null);
    const [slugSuggestion, setSlugSuggestion] = useState(null); // null | string

    useEffect(() => {
        if (!slug) { setSlugSuggestion(null); return; }
        const timer = setTimeout(async () => {
            try {
                const res  = await fetch(`${API}/api/events/check-slug?slug=${encodeURIComponent(slug)}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                const json = await res.json();
                setSlugSuggestion(json.available ? null : json.suggestedSlug);
            } catch {
                setSlugSuggestion(null);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [slug, auth.token]);

    function handleTitleChange(e) {
        const val = e.target.value;
        setTitle(val);
        if (!slugEdited) setSlug(slugify(val));
    }

    function handleSlugChange(e) {
        setSlugEdited(true);
        setSlug(e.target.value);
    }

    function handlePinToggle() {
        const next = !pinEnabled;
        setPinEnabled(next);
        if (!next) setPin("");
    }

    function handlePinChange(e) {
        const val = e.target.value.replace(/\D/g, "").slice(0, 8);
        setPin(val);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (pinEnabled && pin.length < 4) {
            setError("PIN must be at least 4 digits.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API}/api/events`, {
                method:  "POST",
                headers: {
                    "Content-Type":  "application/json",
                    Authorization:   `Bearer ${auth.token}`,
                },
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    pinRequired: pinEnabled,
                    pin: pinEnabled ? pin : undefined,
                }),
            });

            const json = await res.json();
            if (!json.ok) {
                setError(json.error || "Failed to create event.");
                return;
            }

            if (!json.needsDriveAuth) {
                navigate(`/dashboard/events/${json.event.id}`);
                return;
            }

            // Trigger Google Drive OAuth
            const authRes = await fetch(`${API}/api/auth/google?eventId=${json.event.id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const authJson = await authRes.json();
            if (!authJson.ok) {
                setError("Event created, but failed to start Drive auth.");
                navigate(`/dashboard/events/${json.event.id}`);
                return;
            }

            window.location.href = authJson.url;
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen text-zinc-900">
            <Glow />
            <Header />

            <main className="pt-24 pb-16 sm:pt-28">
                <Container>
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-zinc-900">Create event</h1>
                        <p className="mt-1 text-sm text-zinc-500">Set up a new event to collect guest uploads.</p>
                    </div>

                    {/* Info banner — only shown when Drive is not yet connected */}
                    {!auth.user?.driveConnected && (
                        <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                            After creating the event you'll be asked to connect Google Drive so uploads land in a dedicated folder.
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5" htmlFor="title">
                                Event title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                placeholder="Summer Wedding 2026"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5" htmlFor="slug">
                                Slug
                            </label>
                            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-200">
                                <span className="pl-3 text-sm text-zinc-400">/</span>
                                <input
                                    id="slug"
                                    type="text"
                                    value={slug}
                                    onChange={handleSlugChange}
                                    placeholder="summer-wedding-2026"
                                    className="flex-1 bg-transparent px-2 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
                                />
                            </div>
                            <p className="mt-1 text-xs text-zinc-400">Auto-derived from title. Guests will use this URL.</p>
                            {slugSuggestion && (
                                <p className="mt-1.5 text-xs text-amber-600">
                                    That slug is already used — your event will be saved as <strong>{slugSuggestion}</strong>.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5" htmlFor="description">
                                Description <span className="text-zinc-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="A few words about the event..."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                            />
                        </div>

                        {/* PIN protection toggle */}
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-700">PIN protection</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">Require a PIN before guests can upload.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePinToggle}
                                    className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                                        pinEnabled ? "bg-violet-600" : "bg-zinc-300"
                                    }`}
                                    aria-checked={pinEnabled}
                                    role="switch"
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                            pinEnabled ? "translate-x-4.5" : "translate-x-0.5"
                                        }`}
                                    />
                                </button>
                            </div>

                            {pinEnabled && (
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="pin">
                                        PIN <span className="text-zinc-400 font-normal">(4–8 digits)</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="pin"
                                            type={showPin ? "text" : "password"}
                                            value={pin}
                                            onChange={handlePinChange}
                                            inputMode="numeric"
                                            placeholder="••••"
                                            className="w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin((v) => !v)}
                                            className="cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
                                        >
                                            {showPin ? (
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
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-1">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="cursor-pointer rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Creating…" : "Create event"}
                            </button>
                        </div>
                    </form>
                </Container>
            </main>
        </div>
    );
}
