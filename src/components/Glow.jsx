export default function Glow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
            {/* Top — primary violet sweep */}
            <div className="animate-glow-a absolute -top-56 inset-x-[-10%] h-[640px] rounded-full bg-violet-300/40 blur-[130px]" />
            {/* Left — purple */}
            <div className="animate-glow-b absolute top-[22%] -left-[22%] h-[560px] w-[560px] rounded-full bg-purple-400/30 blur-[120px]" />
            {/* Right — violet */}
            <div className="animate-glow-c absolute top-[54%] -right-[18%] h-[580px] w-[580px] rounded-full bg-violet-400/25 blur-[130px]" />
            {/* Bottom — warm fuchsia */}
            <div
                className="animate-glow-b absolute -bottom-44 inset-x-[-5%] h-[520px] rounded-full bg-fuchsia-300/30 blur-[120px]"
                style={{ animationDelay: "-10s" }}
            />
            {/* Centre accent */}
            <div
                className="animate-glow-a absolute top-[40%] left-[20%] h-[440px] w-[480px] rounded-full bg-violet-200/20 blur-[110px]"
                style={{ animationDelay: "-5s" }}
            />
        </div>
    );
}
