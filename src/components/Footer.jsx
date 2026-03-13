export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 py-12">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <a href="/" className="flex items-center gap-2.5">
                            <img src="/logo_black.png" alt="Stashed" className="h-7 w-7" />
                            <span className="text-sm font-semibold text-zinc-900">Stashed</span>
                        </a>
                        <p className="mt-2 text-xs text-zinc-500 max-w-[220px] leading-5">
                            Simple event photo & video collection. No apps, no logins.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                        <a href="/how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
                        <a href="/features"     className="hover:text-zinc-900 transition-colors">Features</a>
                        <a href="/use-cases"    className="hover:text-zinc-900 transition-colors">Use cases</a>
                        <a href="/contact"      className="hover:text-zinc-900 transition-colors">Contact</a>
                        <a href="/login"        className="hover:text-zinc-900 transition-colors">Log in</a>
                    </nav>
                </div>
                <div className="mt-10 border-t border-zinc-100 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Stashed. All rights reserved.</p>
                    <p className="text-xs text-zinc-500">Media collection for events.</p>
                </div>
            </div>
        </footer>
    );
}
