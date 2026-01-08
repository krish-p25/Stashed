export default function Header() {
    return (
        <header className="relative">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                    {/* Left: logo */}
                    <a href="/" className="flex items-center gap-3">
                        <img src="/logo_white.png" alt="Stashed" className="h-9 w-9" />
                        <div className="leading-tight">
                            <div className="font-semibold text-white">Stashed</div>
                            <div className="text-xs text-white/60 font-normal">Media Collection</div>
                        </div>
                    </a>

                    {/* Middle (mobile only): CTA shown when nav is on next line */}
                    <div className="flex items-center md:hidden">
                        <a
                            href="/#contact"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                        >
                            Get early access
                        </a>
                    </div>

                    {/* Nav */}
                    <nav
                        className="
                        order-3 w-full justify-center
                        flex flex-wrap items-center gap-x-6 gap-y-3
                        text-sm text-white/70
                        md:order-none md:w-auto
                        "
                    >
                        <a className="hover:text-white" href="/how-it-works">How it works</a>
                        <a className="hover:text-white" href="/features">Features</a>
                        <a className="hover:text-white" href="/use-cases">Use cases</a>
                        <a className="hover:text-white" href="/login">Log in</a>

                        {/* CTA (desktop only) */}
                        <a
                            href="/contact"
                            className="hidden md:inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                        >
                            Get early access
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}
