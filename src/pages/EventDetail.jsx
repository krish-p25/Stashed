import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
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
                        {upload.status}
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
            className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            title="Copy slug"
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

export default function EventDetail() {
    const { id }          = useParams();
    const auth            = useAuth();
    const navigate        = useNavigate();
    const [searchParams]  = useSearchParams();

    const [event,      setEvent]      = useState(null);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [driveToast, setDriveToast] = useState(searchParams.get("drive") === "connected");

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API}/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                if (res.status === 401) {
                    auth.logout();
                    navigate("/login");
                    return;
                }
                if (res.status === 404) {
                    navigate("/dashboard");
                    return;
                }
                const json = await res.json();
                if (!json.ok) throw new Error(json.error || "Failed to load event.");
                setEvent(json.event);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    return (
        <div className="min-h-screen text-zinc-900">
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
                                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[event.status] ?? STATUS_STYLES.closed}`}>
                                                {event.status}
                                            </span>
                                            <div className="flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-0.5">
                                                <span className="font-mono text-xs text-violet-600">/{event.slug}</span>
                                                <CopyButton text={event.slug} />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-zinc-400">
                                        Created {new Date(event.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

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
