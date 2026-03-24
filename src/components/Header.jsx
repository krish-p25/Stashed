import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/how-it-works", label: "How it works" },
        { href: "/features",     label: "Features"     },
        { href: "/use-cases",    label: "Use cases"    },
        { href: "/login",        label: "Log in"       },
    ];

    return (
        /* Fixed full-width transparent rail — never blocks clicks */
        <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">

            {/* Island wrapper — animates margin-top and max-width */}
            <div
                className={`pointer-events-auto mx-auto transition-all duration-300 ease-linear ${
                    scrolled
                        ? "mt-3 max-w-5xl px-4 sm:px-6"
                        : "mt-0 max-w-[100vw] px-0"
                }`}
            >
                {/* Island body — animates shape, shadow, border */}
                <div
                    className={`transition-all duration-300 ease-linear ${
                        scrolled
                            ? "bg-white/60 backdrop-blur-xl rounded-2xl border border-violet-200/60 shadow-[0_8px_40px_rgba(139,92,246,0.18)]"
                            : "bg-white/90 backdrop-blur-md border-b border-transparent shadow-none rounded-none"
                    }`}
                >
                    {/* Main bar */}
                    <div
                        className={`flex items-center justify-between w-full px-5 sm:px-6 transition-[height] duration-300 ease-linear ${
                            scrolled ? "h-14" : "h-16"
                        }`}
                    >
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2.5 shrink-0">
                            <img src="/logo_black.png" alt="Stashed" className="h-8 w-8" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-zinc-900">Stashed</div>
                                <div className="text-[10px] text-zinc-500 font-normal">Media Collection</div>
                            </div>
                        </a>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                        pathname === href
                                            ? "text-violet-700 bg-violet-100 font-medium"
                                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                                    }`}
                                >
                                    {label}
                                </a>
                            ))}
                            <a
                                href="/contact"
                                className="ml-3 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                            >
                                Get early access
                            </a>
                        </nav>

                        {/* Mobile */}
                        <div className="flex items-center gap-2 md:hidden">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                            >
                                Get access
                            </a>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 transition-colors"
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                            >
                                {menuOpen ? (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M1 4h12M1 7h12M1 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile dropdown */}
                    <div
                        className={`overflow-hidden transition-all duration-200 ease-linear md:hidden ${
                            menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="border-t border-zinc-200/60 py-3 px-5 sm:px-6">
                            <nav className="flex flex-col gap-0.5">
                                {navLinks.map(({ href, label }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                            pathname === href
                                                ? "bg-violet-100 text-violet-700 font-medium"
                                                : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                                        }`}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
