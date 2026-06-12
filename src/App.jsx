import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = {
  Amazon:   { color: "#FF9900", bg: "#1a1000", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",   label: "Amazon",   url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  Flipkart: { color: "#2874F0", bg: "#00082a", icon: "https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploremore-74608b.svg", label: "Flipkart", url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  Meesho:   { color: "#F43397", bg: "#1a0010", icon: null, label: "Meesho",   url: (q) => `https://meesho.com/search?q=${encodeURIComponent(q)}` },
  Snapdeal: { color: "#E40046", bg: "#1a0008", icon: null, label: "Snapdeal", url: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}` },
  Myntra:   { color: "#FF3F6C", bg: "#1a0010", icon: null, label: "Myntra",   url: (q) => `https://www.myntra.com/${encodeURIComponent(q)}` },
  Shopsy:   { color: "#F54D9E", bg: "#1a0018", icon: null, label: "Shopsy",   url: (q) => `https://www.shopsy.in/search?q=${encodeURIComponent(q)}` },
};

const STEPS = [
  "Amazon pe search ho raha hai...",
  "Flipkart se prices aa rahe hain...",
  "Meesho & Snapdeal check ho raha hai...",
  "Myntra & Shopsy dekh raha hoon...",
  "Best deal select ho raha hai...",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

const fakeGraph = (basePrice) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((m, i) => ({
    month: m,
    price: Math.round(basePrice * (0.85 + Math.random() * 0.3 + (i % 3 === 0 ? 0.1 : 0))),
  }));
};

// ── Input style ───────────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "13px 15px", borderRadius: 10,
  border: "1px solid #222", background: "#111", color: "#eee",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", marginBottom: 10,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════════════════════
function Auth({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (tab === "signup" && !f.name.trim()) return setErr("Naam dalo");
    if (!f.email.includes("@")) return setErr("Sahi email dalo");
    if (f.pass.length < 4) return setErr("Password ≥ 4 characters");
    onAuth({ name: f.name || f.email.split("@")[0], email: f.email });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>🔍</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff" }}>DealRadar</h1>
          <p style={{ margin: "5px 0 0", color: "#3d3d55", fontSize: 13 }}>India ka smartest price comparison</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#111", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {["login", "signup"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setErr(""); }}
              style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: tab === t ? "#1c1c2e" : "transparent", color: tab === t ? "#818cf8" : "#444" }}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "#111", borderRadius: 14, padding: 22, border: "1px solid #1c1c2e" }}>
          {tab === "signup" && <input style={inp} placeholder="Tera naam" value={f.name} onChange={set("name")} />}
          <input style={inp} placeholder="Email" type="email" value={f.email} onChange={set("email")} />
          <input style={{ ...inp, marginBottom: err ? 6 : 14 }} placeholder="Password" type="password" value={f.pass}
            onChange={set("pass")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {err && <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 10px" }}>{err}</p>}

          <button onClick={submit} style={{
            width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "#fff",
            fontWeight: 800, fontSize: 15, boxShadow: "0 4px 20px #4f46e555",
          }}>{tab === "login" ? "Log In →" : "Account Banao →"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
            <span style={{ color: "#333", fontSize: 11 }}>ya</span>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
          </div>

          <button onClick={() => onAuth({ name: "Guest", email: "" })} style={{
            width: "100%", padding: "12px 0", borderRadius: 10,
            border: "1px solid #1c1c2e", background: "transparent",
            color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Guest ke taur pe continue karo</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SEARCH RESULTS  (card grid — like BuyHatke home)
// ═══════════════════════════════════════════════════════════════════════════════
function SearchResults({ results, onSelect, query }) {
  return (
    <div style={{ padding: "16px 14px" }}>
      <p style={{ color: "#444", fontSize: 12, margin: "0 0 12px" }}>
        <span style={{ color: "#818cf8", fontWeight: 700 }}>{results.length}</span> results for "{query}"
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map((p) => {
          const minPrice = Math.min(...p.prices.map((x) => x.price));
          const maxOff = Math.max(...p.prices.map((x) => x.discount));
          return (
            <div key={p.id} onClick={() => onSelect(p)}
              style={{
                background: "#111", borderRadius: 12, border: "1px solid #1c1c2e",
                padding: "14px", cursor: "pointer", display: "flex", gap: 14,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4f46e5"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1c1c2e"}
            >
              {/* Emoji thumb */}
              <div style={{ width: 64, height: 64, background: "#1c1c2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#ddd", lineHeight: 1.35,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.name}
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "#4ade80" }}>{rupee(minPrice)}</span>
                  <span style={{ fontSize: 11, color: "#555" }}>se shuru</span>
                  <span style={{ background: "#14532d", color: "#4ade80", padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>
                    {maxOff}% tak off
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {p.prices.map((px) => {
                    const pl = PLATFORMS[px.platform];
                    return pl ? (
                      <span key={px.platform} style={{ background: pl.bg, color: pl.color, border: `1px solid ${pl.color}44`, borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                        {px.platform}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={{ color: "#333", fontSize: 18, alignSelf: "center" }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCT DETAIL  (BuyHatke style: platform list + price graph)
// ═══════════════════════════════════════════════════════════════════════════════
function ProductDetail({ product, onBack, query }) {
  const [graphPlatform, setGraphPlatform] = useState(product.prices[0]?.platform);
  const graphData = fakeGraph(product.prices.find((p) => p.platform === graphPlatform)?.price || 10000);
  const minPrice = Math.min(...product.prices.map((p) => p.price));
  const sorted = [...product.prices].sort((a, b) => a.price - b.price);

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Product hero */}
      <div style={{ background: "#111", margin: "0 14px 0", borderRadius: "0 0 14px 14px", padding: "16px 14px 20px", borderBottom: "1px solid #1c1c2e" }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 80, height: 80, background: "#1c1c2e", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
            {product.emoji}
          </div>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#e0e0e0", lineHeight: 1.4 }}>{product.name}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#4ade80" }}>{rupee(minPrice)}</span>
              <span style={{ fontSize: 12, color: "#555" }}>sabse sasta</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span style={{ background: "#1c1c2e", color: "#818cf8", padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>⭐ {product.rating}</span>
              <span style={{ background: "#1c1c2e", color: "#555", padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>{product.reviews} ratings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price comparison list */}
      <div style={{ padding: "20px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Price Comparison
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((px, i) => {
            const pl = PLATFORMS[px.platform];
            if (!pl) return null;
            const isBest = px.price === minPrice;
            const savings = px.mrp - px.price;

            return (
              <div key={px.platform} style={{
                background: isBest ? "#0b1f0b" : "#111",
                borderRadius: 12,
                border: isBest ? "1.5px solid #4ade80" : "1px solid #1c1c2e",
                padding: "14px 14px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                {/* Rank */}
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "#4ade80" : "#1c1c2e",
                  color: i === 0 ? "#000" : "#555", fontWeight: 900, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>

                {/* Platform name */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ color: pl.color, fontWeight: 800, fontSize: 14 }}>{px.platform}</span>
                    {isBest && <span style={{ background: "#4ade80", color: "#000", padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 900 }}>BEST PRICE</span>}
                    {px.badge && !isBest && <span style={{ background: "#4f46e522", color: "#818cf8", padding: "1px 7px", borderRadius: 10, fontSize: 10 }}>{px.badge}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: px.delivery === "Free" ? "#4ade80" : "#555" }}>
                      {px.delivery === "Free" ? "✓ Free Delivery" : `📦 ${px.delivery}`}
                    </span>
                    <span style={{ color: "#333", fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 11, color: "#555" }}>{px.deliveryDays}</span>
                  </div>
                  {savings > 0 && (
                    <span style={{ fontSize: 11, color: "#f97316" }}>₹{savings.toLocaleString()} bachenge MRP se</span>
                  )}
                </div>

                {/* Price + button */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ marginBottom: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: isBest ? "#4ade80" : "#fff" }}>{rupee(px.price)}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#444", textDecoration: "line-through", display: "block", marginBottom: 6 }}>{rupee(px.mrp)}</span>
                  <button
                    onClick={() => window.open(pl.url(query), "_blank")}
                    style={{
                      padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                      background: pl.color, color: px.platform === "Amazon" ? "#000" : "#fff",
                      fontWeight: 800, fontSize: 12, whiteSpace: "nowrap",
                    }}>
                    Visit Store →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price History Graph */}
      <div style={{ padding: "24px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Price History (12 months)
        </p>

        {/* Platform selector */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {sorted.map((px) => {
            const pl = PLATFORMS[px.platform];
            const active = graphPlatform === px.platform;
            return pl ? (
              <button key={px.platform} onClick={() => setGraphPlatform(px.platform)}
                style={{
                  padding: "5px 12px", borderRadius: 20, border: "1px solid",
                  cursor: "pointer", fontSize: 11, fontWeight: 700,
                  background: active ? pl.color : "transparent",
                  color: active ? (px.platform === "Amazon" ? "#000" : "#fff") : pl.color,
                  borderColor: pl.color,
                }}>
                {px.platform}
              </button>
            ) : null;
          })}
        </div>

        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "16px 8px 8px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={graphData}>
              <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} width={55}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip
                contentStyle={{ background: "#1c1c2e", border: "none", borderRadius: 8, color: "#eee", fontSize: 12 }}
                formatter={(v) => [rupee(v), "Price"]}
              />
              <Line type="monotone" dataKey="price" stroke={PLATFORMS[graphPlatform]?.color || "#818cf8"}
                strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lowest / Highest / Current */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[
            { label: "Lowest", val: rupee(Math.min(...graphData.map(d => d.price))), color: "#4ade80" },
            { label: "Highest", val: rupee(Math.max(...graphData.map(d => d.price))), color: "#f87171" },
            { label: "Current", val: rupee(sorted.find(p => p.platform === graphPlatform)?.price || 0), color: "#818cf8" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 10, border: "1px solid #1c1c2e", padding: "10px 8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#444", marginBottom: 4 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key specs */}
      <div style={{ padding: "20px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Features</p>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "12px 14px" }}>
          {product.features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < product.features.length - 1 ? "1px solid #1c1c2e" : "none" }}>
              <span style={{ color: "#4f46e5", fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 13, color: "#999" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");

  if (!user) return <Auth onAuth={setUser} />;

  const callClaude = async (q) => {
    const prompt = `Shopping aggregator India. User searched: "${q}".

Respond with ONLY a JSON array. No text before or after. No markdown. No backticks.

Array of 4 products. Each product:
{"id":1,"name":"Apple iPhone 15 128GB Blue","emoji":"📱","rating":"4.5","reviews":"8,234","features":["6.1 inch OLED","48MP camera","A16 Bionic chip","USB-C"],"prices":[{"platform":"Amazon","price":69999,"mrp":79900,"discount":12,"delivery":"Free","deliveryDays":"Tomorrow","badge":"Best Seller"},{"platform":"Flipkart","price":71999,"mrp":79900,"discount":10,"delivery":"Free","deliveryDays":"2-3 days","badge":""},{"platform":"Meesho","price":67500,"mrp":79900,"discount":15,"delivery":"₹40","deliveryDays":"4-5 days","badge":"Trending"}]}

Generate 4 products like above for the search query. Prices must be realistic INR values. Platforms: Amazon, Flipkart, Meesho, Snapdeal, Myntra, Shopsy.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-dangerous-direct-browser-only-key": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = data.content.map((b) => b.text || "").join("");
    const clean = raw.replace(/```(?:json)?|```/g, "").trim();
    const match = clean.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  };

  const search = async () => {
    const q = inputVal.trim();
    if (!q) return;
    setQuery(q);
    setSelected(null);
    setResults([]);
    setErr("");
    setLoading(true);
    setStep(0);
    const iv = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 750);
    try {
      const data = await callClaude(q);
      setResults(data);
    } catch (e) {
      console.error("Search error:", e);
      setErr("Error: " + e.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", maxWidth: 500, margin: "0 auto", background: "#09090f", color: "#e5e5e5", fontFamily: "'Segoe UI',sans-serif", position: "relative" }}>

      {/* ── TOP NAV ─────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#09090f", borderBottom: "1px solid #1c1c2e" }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          {selected ? (
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 20, padding: "0 4px 0 0", lineHeight: 1 }}>
              ‹
            </button>
          ) : (
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
          )}

          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search karo — iPhone, shoes, TV..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 9, border: "1px solid #1c1c2e",
                background: "#111", color: "#eee", fontSize: 13, outline: "none", fontFamily: "inherit",
              }}
            />
            <button onClick={search}
              style={{
                padding: "10px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
              }}>
              Search
            </button>
          </div>

          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "#fff", flexShrink: 0, cursor: "pointer" }}
            onClick={() => setUser(null)} title="Logout">
            {user.name[0].toUpperCase()}
          </div>
        </div>

        {/* breadcrumb */}
        {selected && (
          <div style={{ padding: "4px 14px 10px", display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ color: "#444", fontSize: 12, cursor: "pointer" }} onClick={() => setSelected(null)}>Results</span>
            <span style={{ color: "#333", fontSize: 12 }}>›</span>
            <span style={{ color: "#818cf8", fontSize: 12,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>
              {selected.name}
            </span>
          </div>
        )}
      </div>

      {/* ── LOADING ─────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "70px 20px" }}>
          <div style={{ fontSize: 38, marginBottom: 18, display: "inline-block", animation: "spin 1.1s linear infinite" }}>⚡</div>
          <p style={{ color: "#818cf8", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{STEPS[step]}</p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f46e5",
                animation: `pulse 0.9s ${i * 0.25}s infinite alternate` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR ───────────────────────────────────────────────── */}
      {err && !loading && (
        <div style={{ margin: 14, background: "#1a0808", border: "1px solid #7f1d1d", borderRadius: 10, padding: "14px", textAlign: "center", color: "#f87171", fontSize: 13 }}>
          {err}
        </div>
      )}

      {/* ── LANDING ─────────────────────────────────────────────── */}
      {!loading && !results.length && !err && (
        <div style={{ textAlign: "center", padding: "60px 20px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
          <h2 style={{ color: "#fff", fontSize: 18, margin: "0 0 6px", fontWeight: 800 }}>Kya dhundhna hai?</h2>
          <p style={{ color: "#333", fontSize: 13, marginBottom: 24 }}>Amazon, Flipkart, Meesho — sabka price ek jagah</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["iPhone 15", "Nike shoes", "boAt earbuds", "Samsung TV", "Levi's jeans"].map((s) => (
              <button key={s} onClick={() => { setInputVal(s); }}
                style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #1c1c2e",
                  background: "#111", color: "#666", cursor: "pointer", fontSize: 12 }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS / DETAIL ────────────────────────────────────── */}
      {!loading && !selected && results.length > 0 && (
        <SearchResults results={results} onSelect={setSelected} query={query} />
      )}
      {!loading && selected && (
        <ProductDetail product={selected} onBack={() => setSelected(null)} query={query} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { from { opacity:.3; transform:scale(.8); } to { opacity:1; transform:scale(1); } }
        * { box-sizing: border-box; }
        input { font-family: 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
