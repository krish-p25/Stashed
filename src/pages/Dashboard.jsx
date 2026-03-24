import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function EventCard({ event }) {
    return (
        <Link
            to={`/dashboard/events/${event.id}`}
            className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-violet-700 transition-colors leading-snug">
                    {event.title}
                </h3>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[event.status] ?? STATUS_STYLES.closed}`}>
                    {event.status}
                </span>
            </div>

            <span className="inline-block self-start rounded-lg border border-violet-100 bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-600">
                /{event.slug}
            </span>

            <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
                <span>{event.uploadCount} {event.uploadCount === 1 ? "upload" : "uploads"}</span>
                <span>{new Date(event.createdAt).toLocaleDateString()}</span>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const auth     = useAuth();
    const navigate = useNavigate();

    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                if (res.status === 401) {
                    auth.logout();
                    navigate("/login");
                    return;
                }
                const json = await res.json();
                if (!json.ok) throw new Error(json.error || "Failed to load dashboard.");
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className={`min-h-screen text-zinc-900 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
            <Glow />
            <Header />

            <main className="pt-24 pb-16 sm:pt-28">
                <Container>
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

                    {data && (
                        <div className="space-y-10">
                            {/* User card */}
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-200/70 bg-white p-6 shadow-sm shadow-violet-100/30">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wide">Signed in as</p>
                                    <p className="mt-1 text-lg font-semibold text-zinc-900">{data.user.username}</p>
                                    <p className="text-sm text-zinc-500">{data.user.email}</p>
                                </div>
                                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600 whitespace-nowrap">
                                    Early Access
                                </span>
                            </div>

                            {/* Events section */}
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-semibold text-zinc-900">Your events</h2>
                                    <button
                                        onClick={() => navigate("/dashboard/events/new")}
                                        className="cursor-pointer rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                                    >
                                        + New event
                                    </button>
                                </div>

                                {data.events.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-8 py-16 text-center">
                                        <p className="text-zinc-500 text-sm">No events yet.</p>
                                        <p className="mt-1 text-xs text-zinc-400">Events you create will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {data.events.map((ev) => (
                                            <EventCard key={ev.id} event={ev} />
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
