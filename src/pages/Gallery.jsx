import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function TopBar() {
    return (
        <header className="fixed inset-x-0 top-0 z-20 flex items-center px-4 py-3 sm:px-8 bg-white/80 backdrop-blur-md border-b border-zinc-100">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo_black.png" alt="Stashed" className="h-6 w-6" />
                <span className="text-sm font-semibold text-zinc-800 tracking-wide">Stashed</span>
            </Link>
        </header>
    );
}

function Spinner() {
    return (
        <div className="flex items-center justify-center py-32">
            <div className="h-6 w-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
        </div>
    );
}

function PinGate({ onSubmit, error, loading }) {
    const [pin, setPin] = useState("");
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (pin.length >= 4) onSubmit(pin);
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="w-full max-w-sm mx-auto px-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center space-y-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 mx-auto">
                        <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900">PIN required</h2>
                        <p className="mt-1 text-sm text-zinc-500">Enter the PIN to view this gallery.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            ref={inputRef}
                            type="password"
                            inputMode="numeric"
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                            placeholder="••••"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-lg tracking-widest text-zinc-900 placeholder-zinc-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors"
                        />
                        {error && <p className="text-xs text-rose-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={pin.length < 4 || loading}
                            className="w-full cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Checking…" : "View Gallery"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Gallery() {
    const { userId, slug } = useParams();
    const [event,       setEvent]       = useState(null);
    const [uploads,     setUploads]     = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [pinRequired, setPinRequired] = useState(false);
    const [pinError,    setPinError]    = useState(null);
    const [pinLoading,  setPinLoading]  = useState(false);

    async function loadGallery(pin = null) {
        const url = `${API}/api/public/events/${userId}/${slug}/gallery${pin ? `?pin=${encodeURIComponent(pin)}` : ""}`;
        const res  = await fetch(url);
        const json = await res.json();

        if (res.status === 401 && json.pinRequired) {
            setPinRequired(true);
            setLoading(false);
            return;
        }
        if (!json.ok) throw new Error(json.error || "Failed to load gallery.");
        setEvent(json.event);
        setUploads(json.uploads);
        setPinRequired(false);
    }

    useEffect(() => {
        loadGallery().catch(err => setError(err.message)).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, slug]);

    async function handlePinSubmit(pin) {
        setPinLoading(true);
        setPinError(null);
        try {
            await loadGallery(pin);
        } catch (err) {
            if (err.message?.toLowerCase().includes("pin")) {
                setPinError(err.message);
            } else {
                // HTTP 403 from loadGallery throws "Incorrect PIN."
                setPinError("Incorrect PIN.");
            }
        } finally {
            setPinLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <TopBar />
            <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {loading && <Spinner />}

                {error && (
                    <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && pinRequired && (
                    <PinGate
                        onSubmit={handlePinSubmit}
                        error={pinError}
                        loading={pinLoading}
                    />
                )}

                {event && !pinRequired && (
                    <>
                        <div className="mt-8 mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">{event.title}</h1>
                            {event.description && (
                                <p className="mt-1.5 text-sm text-zinc-500">{event.description}</p>
                            )}
                            <p className="mt-1 text-xs text-zinc-400">{uploads.length} photo{uploads.length !== 1 ? "s" : ""}</p>
                        </div>

                        {uploads.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-200 px-8 py-20 text-center">
                                <p className="text-zinc-500 text-sm">No photos yet — check back soon.</p>
                            </div>
                        ) : (
                            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                                {uploads.map((upload) => (
                                    <div key={upload.id} className="break-inside-avoid rounded-xl overflow-hidden border border-zinc-100 shadow-sm bg-white">
                                        {upload.mimeType?.startsWith("image/") ? (
                                            <img
                                                src={upload.fileUrl}
                                                alt={upload.fileName}
                                                className="w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="aspect-square flex flex-col items-center justify-center gap-2 p-4 bg-zinc-50">
                                                <svg className="h-8 w-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                <span className="text-xs text-zinc-400 break-all text-center">{upload.fileName}</span>
                                            </div>
                                        )}
                                        {upload.uploaderName && (
                                            <div className="px-3 py-2">
                                                <p className="text-xs text-zinc-400">{upload.uploaderName}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
