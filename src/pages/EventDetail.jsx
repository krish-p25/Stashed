import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Header from "../components/Header";
import Glow   from "../components/Glow";
import { useAuth } from "../context/useAuth";

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
                <p className="text-xs text-zinc-400">
                    {new Date(upload.createdAt).toLocaleDateString()}
                </p>
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
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const EyeOn = () => (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

function QRModal({ event, uploadUrl, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 200);
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
            onClick={handleClose}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                className={`relative w-full max-w-sm transition-all duration-200 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Shareable card */}
                <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">

                    {/* Top gradient band */}
                    <div className="bg-gradient-to-br from-violet-600 to-violet-500 px-7 pt-7 pb-8">
                        {/* Branding */}
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/logo_black.png" alt="Stashed" className="h-6 w-6 brightness-0 invert" />
                            <span className="text-sm font-semibold text-white/90 tracking-wide">Stashed</span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-2xl font-bold text-white leading-snug">
                            {event.title}
                        </h2>
                        <p className="mt-1.5 text-sm text-violet-200">
                            Scan to upload your photos &amp; videos
                        </p>
                    </div>

                    {/* QR code area */}
                    <div className="flex flex-col items-center px-7 py-7 bg-white">
                        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 shadow-inner">
                            <QRCodeSVG
                                value={uploadUrl}
                                size={192}
                                fgColor="#18181b"
                                bgColor="transparent"
                                level="M"
                            />
                        </div>

                        {/* URL */}
                        <p className="mt-4 text-xs text-zinc-400 font-mono text-center break-all">
                            {uploadUrl}
                        </p>

                        {/* Tagline */}
                        <p className="mt-4 text-xs text-zinc-400 text-center leading-relaxed">
                            Point your camera at the QR code to instantly upload to this event — no app required.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-7 pb-6 flex items-center justify-between">
                        <span className="text-xs text-zinc-300">stashed.krishrp.xyz</span>
                        <button
                            onClick={handleClose}
                            className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShareSection({ event, token, onUpdated }) {
    const uploadUrl = `${window.location.origin}/upload/${event.userId}/${event.slug}`;
    const [copied,  setCopied]  = useState(false);
    const [showQR,  setShowQR]  = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(uploadUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            {showQR && (
                <QRModal
                    event={event}
                    uploadUrl={uploadUrl}
                    onClose={() => setShowQR(false)}
                />
            )}

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100">
                        <svg className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-800">Share with guests</p>
                        <p className="text-xs text-zinc-400">Send this link or QR code so guests can upload.</p>
                    </div>
                </div>

                {/* URL row */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                        <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs font-mono text-zinc-600 truncate">{uploadUrl}</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        title={copied ? "Copied!" : "Copy link"}
                        className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors duration-200"
                    >
                        {copied ? (
                            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                    </button>
                    <button
                        onClick={() => setShowQR(true)}
                        className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors duration-200"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span className="hidden sm:inline">View QR Code</span>
                        <span className="sm:hidden">QR</span>
                    </button>
                </div>

                <InlinePinSection event={event} token={token} onUpdated={onUpdated} />
            </div>
        </>
    );
}

function GallerySection({ event, token, onUpdated }) {
    const galleryUrl   = `${window.location.origin}/gallery/${event.userId}/${event.slug}`;
    const [copied,      setCopied]      = useState(false);
    const [saving,      setSaving]      = useState(false);
    const [showAll,     setShowAll]     = useState(false);
    const [reviewQueue, setReviewQueue] = useState(null);
    const [reviewPos,   setReviewPos]   = useState(0);
    const [reviewBusy,  setReviewBusy]  = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(galleryUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function toggleAutoApprove() {
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/events/${event.id}/settings`, {
                method:  "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body:    JSON.stringify({ autoApprove: !event.autoApprove }),
            });
            const json = await res.json();
            if (json.ok) onUpdated();
        } finally {
            setSaving(false);
        }
    }

    async function patchUploads(ids, status) {
        await fetch(`${API}/api/events/${event.id}/uploads`, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body:    JSON.stringify({ ids, status }),
        });
    }

    async function batchUpdate(ids, status) {
        await patchUploads(ids, status);
        onUpdated();
    }

    function startReview(groupUploads, startIdx) {
        const queue = [...groupUploads.slice(startIdx), ...groupUploads.slice(0, startIdx)];
        setReviewQueue(queue);
        setReviewPos(0);
    }

    async function handleReviewAction(status) {
        if (!reviewQueue || reviewBusy) return;
        setReviewBusy(true);
        try {
            await patchUploads([reviewQueue[reviewPos].id], status);
            const next = reviewPos + 1;
            if (next >= reviewQueue.length) {
                setReviewQueue(null);
                setReviewPos(0);
                onUpdated();
            } else {
                setReviewPos(next);
            }
        } finally {
            setReviewBusy(false);
        }
    }

    function closeReview() {
        setReviewQueue(null);
        setReviewPos(0);
        onUpdated();
    }

    // Group uploads by uploader name
    const uploads  = event.uploads ?? [];
    const filtered = showAll ? uploads : uploads.filter(u => u.status === "pending");
    const groups   = filtered.reduce((acc, u) => {
        const key = u.uploaderName || "Anonymous";
        if (!acc[key]) acc[key] = [];
        acc[key].push(u);
        return acc;
    }, {});

    const pendingCount  = uploads.filter(u => u.status === "pending").length;
    const isAutoApprove = event.autoApprove !== false;

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm space-y-5">
            {reviewQueue && (
                <ReviewModal
                    upload={reviewQueue[reviewPos]}
                    pos={reviewPos}
                    total={reviewQueue.length}
                    onAction={handleReviewAction}
                    onClose={closeReview}
                    busy={reviewBusy}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100">
                    <svg className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-800">Guest gallery</p>
                    <p className="text-xs text-zinc-400">Share this link so guests can view approved photos.</p>
                </div>
            </div>

            {/* Gallery URL row */}
            <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                    <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-xs font-mono text-zinc-600 truncate">{galleryUrl}</span>
                </div>
                <button
                    onClick={handleCopy}
                    title={copied ? "Copied!" : "Copy gallery link"}
                    className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors duration-200"
                >
                    {copied ? (
                        <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                    <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </button>
                <a
                    href={galleryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors duration-200"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="hidden sm:inline">Preview</span>
                </a>
            </div>

            {/* Auto-approve toggle */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                <div>
                    <p className="text-sm font-medium text-zinc-700">Auto-approve uploads</p>
                    <p className="text-xs text-zinc-400 mt-0.5">New uploads appear in the gallery immediately</p>
                </div>
                <button
                    onClick={toggleAutoApprove}
                    disabled={saving}
                    className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${isAutoApprove ? "bg-violet-600" : "bg-zinc-300"}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isAutoApprove ? "translate-x-6" : "translate-x-1"}`} />
                </button>
            </div>

            {/* Moderation panel — only when auto-approve is off */}
            {!isAutoApprove && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-700">
                            Moderation
                            {pendingCount > 0 && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    {pendingCount} pending
                                </span>
                            )}
                        </p>
                        <button
                            onClick={() => setShowAll(v => !v)}
                            className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showAll ? "Show pending only" : "Show all"}
                        </button>
                    </div>

                    {Object.keys(groups).length === 0 ? (
                        <p className="text-xs text-zinc-400 py-2">
                            {showAll ? "No uploads yet." : "No pending uploads."}
                        </p>
                    ) : (
                        Object.entries(groups).map(([name, groupUploads]) => (
                            <GuestGroup
                                key={name}
                                name={name}
                                uploads={groupUploads}
                                onBatch={batchUpdate}
                                onStartReview={startReview}
                            />
                        ))
                    )}
                </div>
            )}

            <InlinePinSection event={event} token={token} onUpdated={onUpdated} />
        </div>
    );
}

const STATUS_DOT = {
    approved: { bg: "bg-emerald-500", icon: "M5 13l4 4L19 7" },
    hidden:   { bg: "bg-rose-500",    icon: "M6 18L18 6M6 6l12 12" },
    pending:  null,
};

function ReviewModal({ upload, pos, total, onAction, onClose, busy }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        function onKey(e) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className={`relative w-full max-w-sm transition-all duration-200 ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
                    {/* Header: counter + close */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                        <span className="text-xs font-medium text-zinc-500">{pos + 1} of {total}</span>
                        <button onClick={onClose} className="cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image */}
                    <div key={pos} className="bg-zinc-50 flex items-center justify-center" style={{ maxHeight: "55vh", overflow: "hidden" }}>
                        {upload.mimeType?.startsWith("image/") ? (
                            <img
                                src={upload.fileUrl}
                                alt={upload.fileName}
                                className="w-full object-contain"
                                style={{ maxHeight: "55vh" }}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 p-10 text-center">
                                <svg className="h-10 w-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-sm text-zinc-400 break-all">{upload.fileName}</span>
                            </div>
                        )}
                    </div>

                    {/* Info + actions */}
                    <div className="px-4 pt-3 pb-4 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-zinc-800 truncate">{upload.fileName}</p>
                            {upload.uploaderName && (
                                <p className="text-xs text-zinc-400 mt-0.5">{upload.uploaderName}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onAction("hidden")}
                                disabled={busy}
                                className="cursor-pointer flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            >
                                Deny
                            </button>
                            <button
                                onClick={() => onAction("approved")}
                                disabled={busy}
                                className="cursor-pointer flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {busy ? "…" : "Approve"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GuestGroup({ name, uploads, onBatch, onStartReview }) {
    const [acting, setActing] = useState(null);

    async function handleBatch(status) {
        setActing(status === "approved" ? "approve" : "hide");
        await onBatch(uploads.map(u => u.id), status);
        setActing(null);
    }

    return (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
                <p className="text-xs font-medium text-zinc-700">
                    {name}
                    <span className="ml-1.5 text-zinc-400 font-normal">({uploads.length})</span>
                </p>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handleBatch("approved")}
                        disabled={acting !== null}
                        className="cursor-pointer rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                        {acting === "approve" ? "…" : "Approve all"}
                    </button>
                    <button
                        onClick={() => handleBatch("hidden")}
                        disabled={acting !== null}
                        className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                    >
                        {acting === "hide" ? "…" : "Hide all"}
                    </button>
                </div>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
                {uploads.map((upload, i) => {
                    const dot = STATUS_DOT[upload.status];
                    return (
                        <button
                            key={upload.id}
                            onClick={() => onStartReview(uploads, i)}
                            title={`${upload.fileName} — click to review`}
                            className="cursor-pointer relative h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 hover:opacity-80 transition-opacity"
                        >
                            {upload.mimeType?.startsWith("image/") ? (
                                <img src={upload.fileUrl} alt={upload.fileName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
                            )}
                            {dot && (
                                <div className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full ${dot.bg} flex items-center justify-center`}>
                                    <svg className="h-2 w-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={dot.icon} />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function ViewPinButton({ pin }) {
    const [visible, setVisible] = useState(false);
    if (!pin) return null;
    return (
        <button
            onClick={() => setVisible((v) => !v)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
            {visible ? <EyeOff /> : <EyeOn />}
            <span>{visible ? pin : "View PIN"}</span>
        </button>
    );
}

function InlinePinSection({ event, token, onUpdated }) {
    const [mode,       setMode]       = useState(null);
    const [pin,        setPin]        = useState("");
    const [currentPin, setCurrentPin] = useState("");
    const [showPin,    setShowPin]    = useState(false);
    const [saving,     setSaving]     = useState(false);
    const [pinError,   setPinError]   = useState(null);

    function handlePinInput(setter) {
        return (e) => setter(e.target.value.replace(/\D/g, "").slice(0, 8));
    }

    function reset() {
        setMode(null); setPin(""); setCurrentPin(""); setShowPin(false); setPinError(null);
    }

    async function callApi(body) {
        setSaving(true); setPinError(null);
        try {
            const res  = await fetch(`${API}/api/events/${event.id}/pin`, {
                method:  "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body:    JSON.stringify(body),
            });
            const json = await res.json();
            if (!json.ok) { setPinError(json.error || "Failed."); return; }
            onUpdated(); reset();
        } catch { setPinError("Something went wrong."); }
        finally  { setSaving(false); }
    }

    function handleSave() {
        if (pin.length < 4) { setPinError("PIN must be at least 4 digits."); return; }
        callApi(mode === "enable" ? { action: "enable", pin } : { action: "change", currentPin, newPin: pin });
    }

    return (
        <div className="mt-4 pt-4 border-t border-zinc-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <svg className={`h-3.5 w-3.5 shrink-0 ${event.pinRequired ? "text-violet-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-600">PIN protection</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${event.pinRequired ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-500"}`}>
                        {event.pinRequired ? "On" : "Off"}
                    </span>
                </div>
                {!mode && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {event.pinRequired ? (
                            <>
                                <ViewPinButton pin={event.pin} />
                                <button onClick={() => setMode("change")} className="cursor-pointer rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">Change</button>
                                <button onClick={() => callApi({ action: "disable" })} disabled={saving} className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50">Remove</button>
                            </>
                        ) : (
                            <button onClick={() => setMode("enable")} className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Enable PIN
                            </button>
                        )}
                    </div>
                )}
            </div>

            {mode && (
                <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 space-y-3">
                    {pinError && <p className="text-xs text-rose-600">{pinError}</p>}
                    {mode === "change" && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Current PIN</label>
                            <div className="flex items-center gap-2">
                                <input type={showPin ? "text" : "password"} value={currentPin} onChange={handlePinInput(setCurrentPin)} inputMode="numeric" placeholder="••••" className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                                <button type="button" onClick={() => setShowPin(v => !v)} className="cursor-pointer shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">{showPin ? <EyeOff /> : <EyeOn />}</button>
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                            {mode === "change" ? "New PIN" : "PIN"} <span className="text-zinc-400 font-normal">(4–8 digits)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input type={showPin ? "text" : "password"} value={pin} onChange={handlePinInput(setPin)} inputMode="numeric" placeholder="••••" autoFocus className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                            <button type="button" onClick={() => setShowPin(v => !v)} className="cursor-pointer shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">{showPin ? <EyeOff /> : <EyeOn />}</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} disabled={saving} className="cursor-pointer rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors">
                            {saving ? "Saving…" : mode === "change" ? "Change PIN" : "Enable PIN"}
                        </button>
                        <button onClick={reset} disabled={saving} className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">Cancel</button>
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
            <div className={`relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xl transition-all duration-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors duration-200 mb-4"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
                        </svg>
                        Dashboard
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
                        <div className="space-y-6 sm:space-y-8">
                            {/* Drive connected toast */}
                            {driveToast && (
                                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    <span>Google Drive connected — uploads will sync to your Drive folder.</span>
                                    <button
                                        onClick={() => setDriveToast(false)}
                                        className="ml-4 cursor-pointer shrink-0 text-emerald-500 hover:text-emerald-700 transition-colors"
                                        aria-label="Dismiss"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {/* Event header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-zinc-100">
                                {/* Left: title + meta */}
                                <div className="space-y-2.5">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                                        {event.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[event.status] ?? STATUS_STYLES.closed}`}>
                                            {fmtStatus(event.status)}
                                        </span>
<span className="text-xs text-zinc-500">
                                            Created {new Date(event.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: actions */}
                                <div className="flex items-center gap-2 sm:shrink-0">
                                    {event.driveFolderId && (
                                        <a
                                            href={`https://drive.google.com/drive/folders/${event.driveFolderId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors duration-200"
                                        >
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
                                                <path d="M43.65 25L29.9 1.2C28.55.4 27 0 25.45 0 23.9 0 22.35.4 21 1.2l-7.15 4.1L27.5 29H59.8L43.65 25z" fill="#00AC47"/>
                                                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8L73.55 76.8z" fill="#EA4335"/>
                                                <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2L43.65 25z" fill="#00832D"/>
                                                <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2L59.8 53z" fill="#2684FC"/>
                                                <path d="M73.4 26.5l-7.15-4.1C64.9 21.6 63.35 21.2 61.8 21.2c-1.55 0-3.1.4-4.45 1.2L43.65 25 59.8 53h27.3L73.4 26.5z" fill="#FFBA00"/>
                                            </svg>
                                            Go To Drive
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setShowDelete(true)}
                                        className="cursor-pointer flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors duration-200"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Share */}
                            <ShareSection
                                event={event}
                                token={auth.token}
                                onUpdated={loadEvent}
                            />

                            {/* Gallery */}
                            <GallerySection
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
                                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
