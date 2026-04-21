// Shared design tokens — violet/white palette
export const C = {
    bg:          "#ffffff",
    surface:     "#faf9ff",
    card:        "#ffffff",
    border:      "#ddd6fe",       // violet-200
    borderHover: "#c4b5fd",       // violet-300
    text:        "#18181b",       // zinc-900
    muted:       "#52525b",       // zinc-600
    dim:         "#a1a1aa",       // zinc-400
    accent:      "#7c3aed",       // violet-600
    accentHover: "#6d28d9",       // violet-700
    accentBg:    "#f5f3ff",       // violet-50
    accentBgMed: "#ede9fe",       // violet-100
    display:     "'Playfair Display', Georgia, serif",
    mono:        "'DM Mono', 'Courier New', monospace",
    sans:        "'DM Sans', system-ui, sans-serif",
};

// Reusable inline style helpers
export function cardStyle(extra = {}) {
    return {
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        padding: "28px",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        ...extra,
    };
}

export function cardHover(el) {
    el.style.borderColor = C.borderHover;
    el.style.transform   = "translateY(-2px)";
    el.style.boxShadow   = "0 8px 24px rgba(139,92,246,0.1)";
}
export function cardLeave(el) {
    el.style.borderColor = C.border;
    el.style.transform   = "translateY(0)";
    el.style.boxShadow   = "none";
}
