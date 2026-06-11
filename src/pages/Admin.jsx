import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import Glow   from "../components/Glow";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PLANS = ["paid", "free", "trial", "suspended"];

function authHeaders(token) {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ── Plan badge ────────────────────────────────────────────────────────────────
function PlanBadge({ plan }) {
    const styles = {
        paid:      "bg-emerald-100 text-emerald-700 border-emerald-200",
        free:      "bg-zinc-100    text-zinc-600    border-zinc-200",
        trial:     "bg-violet-100  text-violet-700  border-violet-200",
        suspended: "bg-rose-100    text-rose-700    border-rose-200",
    };
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${styles[plan] ?? styles.free}`}>
            {plan}
        </span>
    );
}

// ── Create account form ───────────────────────────────────────────────────────
function CreateUserForm({ token, onCreated }) {
    const [form,    setForm]    = useState({ username: "", email: "", password: "", plan: "paid" });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);
    const [success, setSuccess] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res  = await fetch(`${API}/api/admin/users`, {
                method:  "POST",
                headers: authHeaders(token),
                body:    JSON.stringify(form),
            });
            const json = await res.json();
            if (!json.ok) { setError(json.error); setLoading(false); return; }
            setSuccess(`Account created for ${json.user.email}`);
            setForm({ username: "", email: "", password: "", plan: "paid" });
            onCreated(json.user);
        } catch {
            setError("Request failed. Please try again.");
        }
        setLoading(false);
    }

    const inputCls = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error   && <p className="rounded-xl border border-rose-200    bg-rose-50    px-4 py-2.5 text-sm text-rose-700">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{success}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Username</label>
                    <input type="text" required value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        placeholder="username" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Email</label>
                    <input type="email" required value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="user@example.com" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Password</label>
                    <input type="password" required value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="8+ characters" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Plan</label>
                    <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                        className={inputCls}>
                        {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <button type="submit" disabled={loading}
                className="cursor-pointer rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors">
                {loading ? "Creating…" : "Create account"}
            </button>
        </form>
    );
}

// ── Users table ───────────────────────────────────────────────────────────────
function UsersTable({ users, token, onUpdated }) {
    const [editing, setEditing] = useState({}); // id → plan value while editing
    const [saving,  setSaving]  = useState(null);

    async function savePlan(userId, plan) {
        setSaving(userId);
        try {
            const res  = await fetch(`${API}/api/admin/users/${userId}`, {
                method:  "PATCH",
                headers: authHeaders(token),
                body:    JSON.stringify({ plan }),
            });
            const json = await res.json();
            if (json.ok) {
                onUpdated(json.user);
                setEditing(e => { const n = { ...e }; delete n[userId]; return n; });
            }
        } catch { /* silent */ }
        setSaving(null);
    }

    if (!users.length) {
        return <p className="py-8 text-center text-sm text-zinc-400">No users yet.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {users.map(u => {
                        const isEditing = u.id in editing;
                        const currentPlan = editing[u.id] ?? u.plan;
                        return (
                            <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-zinc-900">{u.username}</td>
                                <td className="px-4 py-3 text-zinc-500">{u.email}</td>
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <select
                                            value={currentPlan}
                                            onChange={e => setEditing(ed => ({ ...ed, [u.id]: e.target.value }))}
                                            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                                        >
                                            {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    ) : (
                                        <PlanBadge plan={u.plan} />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-zinc-400 text-xs">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {isEditing ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => savePlan(u.id, currentPlan)}
                                                disabled={saving === u.id}
                                                className="cursor-pointer rounded-lg bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                                            >
                                                {saving === u.id ? "Saving…" : "Save"}
                                            </button>
                                            <button
                                                onClick={() => setEditing(e => { const n = { ...e }; delete n[u.id]; return n; })}
                                                className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setEditing(e => ({ ...e, [u.id]: u.plan }))}
                                            className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                                        >
                                            Edit plan
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ── Admin page ────────────────────────────────────────────────────────────────
export default function Admin() {
    const { user, token } = useAuth();
    const navigate        = useNavigate();

    const [users,   setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab,     setTab]     = useState("users"); // "users" | "create"

    // Redirect non-admins immediately
    useEffect(() => {
        if (user && !user.isAdmin) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/admin/users`, { headers: authHeaders(token) })
            .then(r => r.json())
            .then(j => { if (j.ok) setUsers(j.users); })
            .finally(() => setLoading(false));
    }, [token]);

    function handleUserCreated(newUser) {
        setUsers(u => [newUser, ...u]);
        setTab("users");
    }

    function handleUserUpdated(updated) {
        setUsers(u => u.map(x => x.id === updated.id ? { ...x, ...updated } : x));
    }

    if (!user?.isAdmin) return null;

    return (
        <div className="min-h-screen">
            <Glow />
            <Header />
            <div className="pt-24 sm:pt-28 pb-16 px-4">
                <div className="mx-auto max-w-5xl space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Admin Panel</h1>
                            <p className="mt-0.5 text-sm text-zinc-500">{users.length} account{users.length !== 1 ? "s" : ""} registered</p>
                        </div>
                        <span className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                            Admin
                        </span>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-zinc-200">
                            {[["users", "Users"], ["create", "Create account"]].map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className={`cursor-pointer px-5 py-3.5 text-sm font-medium transition-colors ${
                                        tab === key
                                            ? "border-b-2 border-violet-600 text-violet-700"
                                            : "text-zinc-500 hover:text-zinc-700"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {tab === "users" && (
                                loading
                                    ? <p className="py-8 text-center text-sm text-zinc-400">Loading…</p>
                                    : <UsersTable users={users} token={token} onUpdated={handleUserUpdated} />
                            )}
                            {tab === "create" && (
                                <CreateUserForm token={token} onCreated={handleUserCreated} />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
