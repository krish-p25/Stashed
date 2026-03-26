import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isImageType(mime) {
    return mime?.startsWith("image/");
}

// ─── Minimal branded header ──────────────────────────────────────────────────

function TopBar() {
    return (
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100">
            <img src="/logo_black.png" alt="Stashed" className="h-7 w-7" />
            <span className="text-sm font-semibold text-zinc-800">Stashed</span>
        </div>
    );
}

// ─── PIN gate ────────────────────────────────────────────────────────────────

function PinGate({ eventTitle, onVerified }) {
    const [pin,     setPin]     = useState("");
    const [error,   setError]   = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res  = await fetch(`${API}/api/public/events/${window._userId}/${window._slug}/verify-pin`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ pin }),
            });
            const json = await res.json();
            if (!json.ok) { setError(json.error || "Incorrect PIN."); return; }
            onVerified(pin);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 mb-5">
                <svg className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-1">PIN required</h2>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                <span className="font-medium text-zinc-700">{eventTitle}</span> is PIN protected.
                Enter the PIN shared with you by the host.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
                <input
                    ref={inputRef}
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(null); }}
                    placeholder="••••"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-xl tracking-[0.3em] text-zinc-900 placeholder-zinc-300 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors"
                />
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button
                    type="submit"
                    disabled={pin.length < 4 || loading}
                    className="w-full cursor-pointer rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Checking…" : "Unlock"}
                </button>
            </form>
        </div>
    );
}

// ─── File thumbnail ──────────────────────────────────────────────────────────

const STATUS_ICON = {
    pending:   null,
    uploading: (
        <div className="h-4 w-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
    ),
    done: (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    ),
    error: (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    ),
};

function FileTile({ file, status }) {
    const preview = useMemo(
        () => (isImageType(file.type) ? URL.createObjectURL(file) : null),
        [file]
    );

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-square">
            {preview ? (
                <img src={preview} alt={file.name} className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                    <svg className="h-6 w-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <span className="text-[10px] text-zinc-400 text-center leading-tight truncate w-full text-center">
                        {file.name}
                    </span>
                </div>
            )}

            {/* Status overlay */}
            {status === "uploading" && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    {STATUS_ICON.uploading}
                </div>
            )}
            {status === "done" && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    {STATUS_ICON.done}
                </div>
            )}
            {status === "error" && (
                <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                    {STATUS_ICON.error}
                </div>
            )}
        </div>
    );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Uploading your photos…</span>
                <span className="font-medium text-zinc-700">{done} / {total}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Upload form ─────────────────────────────────────────────────────────────

function UploadForm({ event, pin, onDone }) {
    const fileInputRef               = useRef(null);
    const [files,        setFiles]        = useState([]);
    const [statuses,     setStatuses]     = useState([]);
    const [uploaderName, setUploaderName] = useState("");
    const [dragging,     setDragging]     = useState(false);
    const [uploading,    setUploading]    = useState(false);
    const [collapsed,    setCollapsed]    = useState(false);
    const [userExpanded, setUserExpanded] = useState(false);

    const doneCount = statuses.filter(s => s === "done").length;

    function addFiles(incoming) {
        const valid = Array.from(incoming).filter(
            (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        );
        if (!uploading) { setCollapsed(false); setUserExpanded(false); }
        setFiles((prev) => [...prev, ...valid]);
        setStatuses((prev) => [...prev, ...valid.map(() => "pending")]);
    }

    function removeFile(i) {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        setStatuses((prev) => prev.filter((_, idx) => idx !== i));
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    }

    async function handleUpload() {
        if (files.length === 0 || uploading) return;
        setUploading(true);
        setCollapsed(true);
        setUserExpanded(false);

        let doneCount = 0;
        for (let i = 0; i < files.length; i++) {
            setStatuses((prev) => prev.map((s, idx) => idx === i ? "uploading" : s));
            try {
                const fd = new FormData();
                fd.append("file", files[i]);
                if (uploaderName.trim()) fd.append("uploaderName", uploaderName.trim());
                if (pin) fd.append("pin", pin);

                const res  = await fetch(`${API}/api/public/events/${event.userId}/${event.slug}/upload`, {
                    method: "POST",
                    body:   fd,
                });
                const json = await res.json();
                if (!json.ok) throw new Error(json.error);
                setStatuses((prev) => prev.map((s, idx) => idx === i ? "done" : s));
                doneCount++;
            } catch {
                setStatuses((prev) => prev.map((s, idx) => idx === i ? "error" : s));
            }
        }

        setUploading(false);
        if (doneCount > 0) onDone(doneCount);
    }

    const pendingCount = statuses.filter((s) => s === "pending").length;
    const buttonLabel  = uploading
        ? "Uploading…"
        : `Upload ${files.length} ${files.length === 1 ? "file" : "files"}`;

    return (
        <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
            {/* Event title */}
            <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">Uploading to</p>
                <h1 className="text-xl font-bold text-zinc-900">{event.title}</h1>
            </div>

            {/* Drop zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
                    dragging
                        ? "border-violet-400 bg-violet-50"
                        : "border-zinc-200 bg-zinc-50 hover:border-violet-300 hover:bg-violet-50/50"
                }`}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-200 ${dragging ? "bg-violet-100" : "bg-zinc-100"}`}>
                        <svg className={`h-6 w-6 transition-colors duration-200 ${dragging ? "text-violet-600" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-700">
                            {dragging ? "Drop to add" : "Tap to add photos or videos"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">or drag and drop</p>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                />
            </div>

            {/* File grid */}
            {files.length > 0 && (
                <>
                    {uploading && <ProgressBar done={doneCount} total={files.length} />}

                    <div className={`relative overflow-hidden transition-all duration-700 ease-in-out ${
                        collapsed && !userExpanded ? "max-h-52" : "max-h-[9999px]"
                    }`}>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {files.map((file, i) => (
                                <div key={i} className="relative">
                                    <FileTile file={file} status={statuses[i]} />
                                    {statuses[i] === "pending" && !uploading && (
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="cursor-pointer absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800/80 text-white shadow"
                                        >
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {collapsed && !userExpanded && (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                        )}
                    </div>

                    {collapsed && (
                        <button
                            type="button"
                            onClick={() => setUserExpanded(v => !v)}
                            className="flex w-full cursor-pointer items-center justify-center gap-1.5 py-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {userExpanded ? (
                                <>
                                    Collapse
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Show all {files.length} photos
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </>
            )}

            {/* Name field */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Your name <span className="text-zinc-400 font-normal">(optional)</span>
                </label>
                <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="e.g. Jane Smith"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors"
                />
            </div>

            {/* Upload button */}
            <button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading || pendingCount === 0}
                className="w-full cursor-pointer rounded-2xl bg-violet-600 py-3.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {buttonLabel}
            </button>
        </div>
    );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ count, eventTitle, onUploadMore }) {
    useEffect(() => {
        confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-5">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-1">
                {count === 1 ? "1 file uploaded" : `${count} files uploaded`}
            </h2>
            <p className="text-sm text-zinc-500 mb-8 max-w-xs">
                Your upload{count === 1 ? "" : "s"} to <span className="font-medium text-zinc-700">{eventTitle}</span> {count === 1 ? "has" : "have"} been received.
            </p>
            <button
                onClick={onUploadMore}
                className="cursor-pointer rounded-2xl border border-violet-200 bg-violet-50 px-6 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
            >
                Upload more
            </button>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Upload() {
    const { userId, slug } = useParams();
    const [phase,    setPhase]    = useState("loading"); // loading | error | pin | upload | done
    const [event,    setEvent]    = useState(null);
    const [error,    setError]    = useState(null);
    const [pin,      setPin]      = useState(null);
    const [doneCount, setDoneCount] = useState(0);
    const [visible,  setVisible]  = useState(false);

    // Expose userId/slug to PinGate (avoids passing through props chain)
    useEffect(() => {
        window._userId = userId;
        window._slug = slug;
    }, [userId, slug]);

    // Fade in on initial load
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Cross-fade helper: scroll to top (if needed) → fade out → swap phase → fade in
    const transitionTo = useCallback((newPhase, count) => {
        const needsScroll = window.scrollY > 0;
        if (needsScroll) window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                if (count !== undefined) setDoneCount(count);
                setPhase(newPhase);
                requestAnimationFrame(() => setVisible(true));
            }, 500);
        }, needsScroll ? 400 : 0);
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const res  = await fetch(`${API}/api/public/events/${userId}/${slug}`);
                const json = await res.json();
                if (!json.ok) { setError(json.error || "Event not found."); transitionTo("error"); return; }

                const ev = json.event;
                setEvent(ev);

                if (ev.status !== "active") {
                    setError("This event is not currently accepting uploads.");
                    transitionTo("error");
                    return;
                }

                transitionTo(ev.pinRequired ? "pin" : "upload");
            } catch {
                setError("Could not load event. Check your connection and try again.");
                transitionTo("error");
            }
        }
        load();
    }, [userId, slug]);

    return (
        <div className="min-h-screen bg-white">
            <TopBar />

            <div className={`transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                {phase === "loading" && (
                    <div className="flex items-center justify-center min-h-[70vh]">
                        <div className="h-6 w-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                    </div>
                )}

                {phase === "error" && (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 mb-4">
                            <svg className="h-7 w-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 mb-1">Unavailable</h2>
                        <p className="text-sm text-zinc-500 max-w-xs">{error}</p>
                    </div>
                )}

                {phase === "pin" && event && (
                    <PinGate
                        eventTitle={event.title}
                        onVerified={(verifiedPin) => { setPin(verifiedPin); transitionTo("upload"); }}
                    />
                )}

                {phase === "upload" && event && (
                    <UploadForm
                        event={event}
                        pin={pin}
                        onDone={(count) => transitionTo("done", count)}
                    />
                )}

                {phase === "done" && event && (
                    <SuccessScreen
                        count={doneCount}
                        eventTitle={event.title}
                        onUploadMore={() => transitionTo("upload")}
                    />
                )}
            </div>
        </div>
    );
}
