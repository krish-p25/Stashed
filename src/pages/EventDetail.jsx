import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function fmtStatus(s) {
    return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const STATUS_STYLES = {
    active:        "border-emerald-200 bg-emerald-50 text-emerald-700",
    closed:        "border-zinc-200 bg-zinc-100 text-zinc-500",
    archived:      "border-amber-200 bg-amber-50 text-amber-700",
    pending_drive: "border-violet-200 bg-violet-50 text-violet-600",
};

const UPLOAD_STATUS_STYLES = {
    pending:  "border-sky-200 bg-sky-50 text-sky-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    hidden:   "border-zinc-200 bg-zinc-100 text-zinc-500",
};

function isImage(mimeType) {
    return mimeType?.startsWith("image/");
}

function UploadCard({ upload }) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="aspect-square bg-zinc-50 flex items-center justify-center overflow-hidden">
                {isImage(upload.mimeType) ? (
                    <img
                        src={upload.fileUrl}
                        alt={upload.fileName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-1 p-4 text-center">
                        <svg className="h-8 w-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs text-zinc-400 break-all">{upload.mimeType}</span>
                    </div>
                )}
            </div>
            <div className="px-3 pb-3 space-y-1">
                <p className="text-xs font-medium text-zinc-700 truncate" title={upload.fileName}>
                    {upload.fileName}
                </p>
                {upload.uploaderName && (
                    <p className="text-xs text-zinc-400">{upload.uploaderName}</p>
                )}
                <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${UPLOAD_STATUS_STYLES[upload.status] ?? UPLOAD_STATUS_STYLES.pending}`}>
                        {fmtStatus(upload.status)}
                    </span>
                    <span className="text-xs text-zinc-400">
                        {new Date(upload.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button
            onClick={handleCopy}
            className="flex cursor-pointer items-center text-zinc-400 hover:text-zinc-600 transition-colors"
            title={copied ? "Copied!" : "Copy slug"}
        >
            {copied ? (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
}

const EyeOff = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const EyeOn = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

function ViewPinButton({ pin }) {
    const [visible, setVisible] = useState(false);

    return (
        <button
            onClick={() => setVisible((v) => !v)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
            {visible ? <EyeOff /> : <EyeOn />}
            {visible ? pin : "View PIN"}
        </button>
    );
}

function PinSection({ event, token, onUpdated }) {
    const [mode,       setMode]       = useState(null); // null | "enable" | "change"
    const [pin,        setPin]        = useState("");
    const [currentPin, setCurrentPin] = useState("");
    const [showPin,    setShowPin]    = useState(false);
    const [saving,     setSaving]     = useState(false);
    const [pinError,   setPinError]   = useState(null);

    function handlePinInput(setter) {
        return (e) => setter(e.target.value.replace(/\D/g, "").slice(0, 8));
    }

    function reset() {
        setMode(null);
        setPin("");
        setCurrentPin("");
        setShowPin(false);
        setPinError(null);
    }

    async function callApi(body) {
        setSaving(true);
        setPinError(null);
        try {
            const res = await fetch(`${API}/api/events/${event.id}/pin`, {
                method:  "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body:    JSON.stringify(body),
            });
            const json = await res.json();
            if (!json.ok) { setPinError(json.error || "Failed."); return; }
            onUpdated();
            reset();
        } catch {
            setPinError("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    function handleSave() {
        if (pin.length < 4) { setPinError("PIN must be at least 4 digits."); return; }
        if (mode === "enable") {
            callApi({ action: "enable", pin });
        } else {
            callApi({ action: "change", currentPin, newPin: pin });
        }
    }

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${event.pinRequired ? "bg-violet-100" : "bg-zinc-100"}`}>
                        <svg className={`h-4 w-4 ${event.pinRequired ? "text-violet-600" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-800">PIN protection</p>
                        <p className="text-xs text-zinc-400">
                            {event.pinRequired ? "Guests must enter a PIN to upload." : "Anyone with the link can upload."}
                        </p>
                    </div>
                </div>

                {!mode && (
                    <div className="flex items-center gap-2">
                        {event.pinRequired ? (
                            <>
                                <ViewPinButton pin={event.pin} />
                                <button
                                    onClick={() => setMode("change")}
                                    className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                                >
                                    Change PIN
                                </button>
                                <button
                                    onClick={() => callApi({ action: "disable" })}
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                                >
                                    Remove PIN
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setMode("enable")}
                                className="cursor-pointer rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                            >
                                Enable PIN
                            </button>
                        )}
                    </div>
                )}
            </div>

            {mode && (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 space-y-3">
                    {pinError && <p className="text-xs text-rose-600">{pinError}</p>}

                    {mode === "change" && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Current PIN</label>
                            <input
                                type={showPin ? "text" : "password"}
                                value={currentPin}
                                onChange={handlePinInput(setCurrentPin)}
                                inputMode="numeric"
                                placeholder="••••"
                                className="w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                            {mode === "change" ? "New PIN" : "PIN"}{" "}
                            <span className="text-zinc-400 font-normal">(4–8 digits)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type={showPin ? "text" : "password"}
                                value={pin}
                                onChange={handlePinInput(setPin)}
                                inputMode="numeric"
                                placeholder="••••"
                                autoFocus
                                className="w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin((v) => !v)}
                                className="cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                {showPin ? <EyeOff /> : <EyeOn />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="cursor-pointer rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saving…" : mode === "change" ? "Change PIN" : "Enable PIN"}
                        </button>
                        <button
                            onClick={reset}
                            disabled={saving}
                            className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeleteModal({ eventTitle, onConfirm, onCancel, deleting }) {
    const [typed,   setTyped]   = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);
    const match = typed === eventTitle;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className={`relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-all duration-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <svg className="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900">Delete event</h2>
                        <p className="mt-1 text-sm text-zinc-500 leading-6">
                            This will permanently delete <span className="font-medium text-zinc-700">{eventTitle}</span> and
                            all of its uploads. Files already synced to Google Drive will not be affected,
                            but this action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <label className="text-xs font-medium text-zinc-600">
                        Type <span className="font-semibold text-zinc-800">{eventTitle}</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={typed}
                        onChange={e => setTyped(e.target.value)}
                        placeholder={eventTitle}
                        className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-colors"
                        autoFocus
                    />
                </div>

                <div className="mt-4 flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!match || deleting}
                        className={[
                            "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                            match && !deleting
                                ? "cursor-pointer bg-rose-600 text-white hover:bg-rose-700"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-400",
                        ].join(" ")}
                    >
                        {deleting ? "Deleting…" : "Delete event"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EventDetail() {
    const { id }          = useParams();
    const auth            = useAuth();
    const navigate        = useNavigate();
    const [searchParams]  = useSearchParams();

    const [event,       setEvent]       = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [driveToast,  setDriveToast]  = useState(searchParams.get("drive") === "connected");
    const [showDelete,  setShowDelete]  = useState(false);
    const [visible,     setVisible]     = useState(false);
    const [deleting,    setDeleting]    = useState(false);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(frameId);
    }, []);

    async function loadEvent() {
        try {
            const res = await fetch(`${API}/api/events/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            if (res.status === 401) { auth.logout(); navigate("/login"); return; }
            if (res.status === 404) { navigate("/dashboard"); return; }
            const json = await res.json();
            if (!json.ok) throw new Error(json.error || "Failed to load event.");
            setEvent(json.event);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEvent();
    }, [id]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`${API}/api/events/${id}`, {
                method:  "DELETE",
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            if (res.status === 401) { auth.logout(); navigate("/login"); return; }
            const json = await res.json();
            if (!json.ok) throw new Error(json.error || "Failed to delete event.");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
            setShowDelete(false);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className={`min-h-screen text-zinc-900 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
            <Glow />
            <Header />

            <main className="pt-24 pb-16 sm:pt-28">
                <Container>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-8"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to dashboard
                    </Link>

                    {loading && (
                        <div className="flex items-center justify-center py-24">
                            <div className="h-6 w-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    {showDelete && event && (
                        <DeleteModal
                            eventTitle={event.title}
                            onConfirm={handleDelete}
                            onCancel={() => setShowDelete(false)}
                            deleting={deleting}
                        />
                    )}

                    {event && (
                        <div className="space-y-8">
                            {/* Drive connected toast */}
                            {driveToast && (
                                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    <span>Google Drive connected — uploads will sync to your Drive folder.</span>
                                    <button
                                        onClick={() => setDriveToast(false)}
                                        className="ml-4 cursor-pointer text-emerald-500 hover:text-emerald-700 transition-colors"
                                        aria-label="Dismiss"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {/* Event header */}
                            <div className="rounded-2xl border border-violet-200/70 bg-white p-6 shadow-sm shadow-violet-100/30">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-2">
                                        <h1 className="text-2xl font-semibold text-zinc-900">{event.title}</h1>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[event.status] ?? STATUS_STYLES.closed}`}>
                                                {fmtStatus(event.status)}
                                            </span>
                                            <div className="flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1">
                                                <span className="font-mono text-xs text-violet-600">/{event.slug}</span>
                                                <CopyButton text={event.slug} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-400">
                                            Created {new Date(event.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => setShowDelete(true)}
                                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* PIN protection */}
                            <PinSection
                                event={event}
                                token={auth.token}
                                onUpdated={loadEvent}
                            />

                            {/* Uploads gallery */}
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                                    Uploads
                                    <span className="ml-2 text-sm font-normal text-zinc-400">
                                        ({event.uploads?.length ?? 0})
                                    </span>
                                </h2>

                                {!event.uploads || event.uploads.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-8 py-16 text-center">
                                        <p className="text-zinc-500 text-sm">No uploads yet.</p>
                                        <p className="mt-1 text-xs text-zinc-400">
                                            Share the event link so guests can start uploading.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                                        {event.uploads.map((upload) => (
                                            <UploadCard key={upload.id} upload={upload} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Container>
            </main>
        </div>
    );
}
