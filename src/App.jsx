import { useState } from "react";

// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORMS = [
  { name: "Amazon",   emoji: "🛒", color: "#FF9900", bg: "#1a1000", border: "#FF990044", url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,              home: "https://www.amazon.in" },
  { name: "Flipkart", emoji: "📦", color: "#2874F0", bg: "#00082a", border: "#2874F044", url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,      home: "https://www.flipkart.com" },
  { name: "Meesho",   emoji: "💜", color: "#F43397", bg: "#1a0010", border: "#F4339744", url: (q) => `https://meesho.com/search?q=${encodeURIComponent(q)}`,            home: "https://meesho.com" },
  { name: "Myntra",   emoji: "👗", color: "#FF3F6C", bg: "#1a0010", border: "#FF3F6C44", url: (q) => `https://www.myntra.com/${encodeURIComponent(q)}`,                  home: "https://www.myntra.com" },
  { name: "Shopsy",   emoji: "🛍️", color: "#F54D9E", bg: "#1a0018", border: "#F54D9E44", url: (q) => `https://www.shopsy.in/search?q=${encodeURIComponent(q)}`,         home: "https://www.shopsy.in" },
  { name: "Snapdeal", emoji: "⚡", color: "#E40046", bg: "#1a0008", border: "#E4004644", url: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}`, home: "https://www.snapdeal.com" },
  { name: "Croma",    emoji: "💻", color: "#67AE3E", bg: "#091a06", border: "#67AE3E44", url: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,         home: "https://www.croma.com" },
  { name: "Ajio",     emoji: "👔", color: "#FF6A00", bg: "#1a0a00", border: "#FF6A0044", url: (q) => `https://www.ajio.com/search/?text=${encodeURIComponent(q)}`,       home: "https://www.ajio.com" },
];

const TRENDING = [
  "iPhone 15", "Samsung Galaxy S24", "Nike Air Force 1",
  "boAt Earbuds", "MacBook Air M2", "Sony Headphones",
  "Samsung 55 inch TV", "Levi's Jeans", "Smartwatch", "Dell Laptop",
];

const CATEGORIES = [
  { label: "Mobiles",     emoji: "📱", q: "smartphones" },
  { label: "Laptops",     emoji: "💻", q: "laptops" },
  { label: "Headphones",  emoji: "🎧", q: "wireless headphones" },
  { label: "TVs",         emoji: "📺", q: "smart tv 55 inch" },
  { label: "Shoes",       emoji: "👟", q: "sneakers" },
  { label: "Watches",     emoji: "⌚", q: "smartwatch" },
  { label: "Clothes",     emoji: "👕", q: "casual shirts" },
  { label: "Cameras",     emoji: "📷", q: "dslr camera" },
];

// ── Auth Input Style ──────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "13px 15px", borderRadius: 10,
  border: "1px solid #1c1c2e", background: "#0d0d18", color: "#eee",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", marginBottom: 10, display: "block",
};

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════════════════════
function Auth({ onAuth }) {
  const [name, setName] = useState("");
  const [err, setErr]   = useState("");

  const submit = () => {
    if (!name.trim()) return setErr("Apna naam dalo");
    onAuth({ name: name.trim() });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>🔍</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>DealRadar</h1>
          <p style={{ margin: "8px 0 0", color: "#3d3d55", fontSize: 13 }}>India ka smartest price comparison</p>
        </div>

        {/* Name input */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, border: "1px solid #1c1c2e" }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "#777", textAlign: "center" }}>Apna naam dalo aur shuru karo!</p>
          <input
            style={{ ...inp, marginBottom: err ? 6 : 16, fontSize: 15, textAlign: "center" }}
            placeholder="Tera naam (e.g. Rahul)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
          {err && <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 12px", textAlign: "center" }}>{err}</p>}

          <button onClick={submit} style={{
            width: "100%", padding: "14px 0", borderRadius: 11, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "#fff", fontWeight: 800, fontSize: 16,
            boxShadow: "0 4px 20px #4f46e544",
          }}>Shuru Karo →</button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
            <span style={{ color: "#333", fontSize: 11 }}>ya</span>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
          </div>

          <button onClick={() => onAuth({ name: "Guest" })} style={{
            width: "100%", padding: "12px 0", borderRadius: 11, border: "1px solid #1c1c2e",
            background: "transparent", color: "#555", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>👤 Guest ke taur pe continue karo</button>
        </div>

        {/* Platform logos preview */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          {["🛒","📦","💜","👗","🛍️","⚡"].map((e,i) => (
            <span key={i} style={{ fontSize: 24, opacity: 0.4 }}>{e}</span>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#2a2a3a", fontSize: 11, marginTop: 8 }}>Amazon · Flipkart · Meesho · Myntra · Shopsy · Snapdeal</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SEARCH RESULTS PAGE  — tabs with iframes
// ═══════════════════════════════════════════════════════════════════════════════
function SearchPage({ query }) {
  const [activeTab, setActiveTab] = useState(null);

  // If a tab is open, show the iframe view
  if (activeTab !== null) {
    const pl = PLATFORMS[activeTab];
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
        {/* Tab bar */}
        <div style={{ background: "#0d0d18", borderBottom: "1px solid #1c1c2e", overflowX: "auto", display: "flex", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
          {PLATFORMS.map((p, i) => (
            <button key={p.name} onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer",
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                color: activeTab === i ? p.color : "#444",
                borderBottom: activeTab === i ? `2px solid ${p.color}` : "2px solid transparent",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        {/* Open in browser button */}
        <div style={{ background: "#0d0d18", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1c1c2e" }}>
          <span style={{ fontSize: 12, color: "#444" }}>"{query}" on {pl.name}</span>
          <button onClick={() => window.open(pl.url(query), "_blank")}
            style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: pl.color, color: pl.name === "Amazon" || pl.name === "Croma" ? "#000" : "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            Browser mein kholо ↗
          </button>
        </div>

        {/* Iframe */}
        <iframe
          key={activeTab}
          src={pl.url(query)}
          style={{ flex: 1, border: "none", width: "100%" }}
          title={pl.name}
        />
      </div>
    );
  }

  // Platform selection page
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: "18px 16px 0" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#444" }}>Search results for</p>
        <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#fff" }}>"{query}"</h2>

        {/* Open All */}
        <button onClick={() => PLATFORMS.forEach((pl) => window.open(pl.url(query), "_blank"))}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 20, boxShadow: "0 4px 20px #4f46e544" }}>
          🚀 Saare Platforms Pe Search Karo (Ek Saath)
        </button>

        <p style={{ margin: "0 0 12px", fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
          Platform choose karo — Tab mein khulegaa
        </p>
      </div>

      {/* Platform Cards */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {PLATFORMS.map((pl, i) => (
          <div key={pl.name} onClick={() => setActiveTab(i)}
            style={{ background: pl.bg, border: `1px solid ${pl.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${pl.color}33`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: pl.color + "22", border: `1px solid ${pl.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              {pl.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 800, color: pl.color }}>{pl.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#444" }}>Tab mein khulegaa · "{query}"</p>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: pl.color, display: "flex", alignItems: "center", justifyContent: "center", color: pl.name === "Amazon" || pl.name === "Croma" ? "#000" : "#fff", fontSize: 16, fontWeight: 900 }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]         = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [query, setQuery]       = useState("");
  const [searched, setSearched] = useState(false);

  if (!user) return <Auth onAuth={setUser} />;

  const search = () => {
    const q = inputVal.trim();
    if (!q) return;
    setQuery(q);
    setSearched(true);
  };

  const reset = () => { setSearched(false); setQuery(""); setInputVal(""); };

  return (
    <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", background: "#09090f", color: "#e5e5e5", fontFamily: "'Segoe UI',sans-serif" }}>

      {/* ── STICKY NAV ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#09090f", borderBottom: "1px solid #1c1c2e" }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>

          {/* Back or Logo */}
          {searched ? (
            <button onClick={reset} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 24, padding: 0, lineHeight: 1 }}>‹</button>
          ) : (
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
          )}

          {/* Search box */}
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search karo — iPhone, Nike, Samsung..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: "1px solid #1c1c2e", background: "#111", color: "#eee", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={search} style={{ padding: "10px 16px", borderRadius: 9, border: "none", cursor: "pointer", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13 }}>
              Search
            </button>
          </div>

          {/* User avatar */}
          <div onClick={() => setUser(null)} title="Logout"
            style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", cursor: "pointer", flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── SEARCH PAGE ── */}
      {searched && <SearchPage query={query} onBack={reset} />}

      {/* ── HOME / LANDING ── */}
      {!searched && (
        <div style={{ padding: "20px 16px 40px" }}>

          {/* Platform Grid */}
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            Seedha Platform Pe Jao
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
            {PLATFORMS.map((pl) => (
              <div key={pl.name}
                onClick={() => window.open(pl.home, "_blank")}
                style={{ background: pl.bg, border: `1px solid ${pl.border}`, borderRadius: 14, padding: "14px 6px", textAlign: "center", cursor: "pointer", transition: "transform 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = `0 4px 18px ${pl.color}44`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 26 }}>{pl.emoji}</div>
                <span style={{ color: pl.color, fontWeight: 800, fontSize: 10, lineHeight: 1 }}>{pl.name}</span>
              </div>
            ))}
          </div>

          {/* Categories */}
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            Categories
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28 }}>
            {CATEGORIES.map((c) => (
              <div key={c.label}
                onClick={() => { setInputVal(c.q); setQuery(c.q); setSearched(true); }}
                style={{ background: "#111", border: "1px solid #1c1c2e", borderRadius: 12, padding: "12px 6px", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4f46e5"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1c1c2e"}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{c.emoji}</div>
                <span style={{ color: "#777", fontSize: 10, fontWeight: 600 }}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* Trending */}
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            Trending Searches
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TRENDING.map((s) => (
              <button key={s}
                onClick={() => { setInputVal(s); setQuery(s); setSearched(true); }}
                style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #1c1c2e", background: "#111", color: "#666", cursor: "pointer", fontSize: 12, transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.color = "#818cf8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1c1c2e"; e.currentTarget.style.color = "#666"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        input { font-family: 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
