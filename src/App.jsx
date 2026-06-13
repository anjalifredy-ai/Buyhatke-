import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORMS = {
  Amazon:   { color: "#FF9900", bg: "#1a1000", emoji: "🛒", url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  Flipkart: { color: "#2874F0", bg: "#00082a", emoji: "📦", url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  Meesho:   { color: "#F43397", bg: "#1a0010", emoji: "💜", url: (q) => `https://meesho.com/search?q=${encodeURIComponent(q)}` },
  Myntra:   { color: "#FF3F6C", bg: "#1a0010", emoji: "👗", url: (q) => `https://www.myntra.com/${encodeURIComponent(q)}` },
  Shopsy:   { color: "#F54D9E", bg: "#1a0018", emoji: "🛍️", url: (q) => `https://www.shopsy.in/search?q=${encodeURIComponent(q)}` },
  Snapdeal: { color: "#E40046", bg: "#1a0008", emoji: "⚡", url: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}` },
  Croma:    { color: "#67AE3E", bg: "#091a06", emoji: "💻", url: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}` },
};

const PLATFORM_NAMES = Object.keys(PLATFORMS);

// ── Default Products ──────────────────────────────────────────────────────────
const DEFAULT_PRODUCTS = [
  {
    id: 1, name: "Apple iPhone 15 128GB Black", emoji: "📱",
    tags: ["iphone", "apple", "mobile", "phone", "smartphone"],
    rating: "4.6", reviews: "21,430",
    features: ["6.1\" Super Retina XDR OLED", "48MP Main Camera", "A16 Bionic Chip", "USB-C Charging"],
    prices: [
      { platform: "Amazon",   price: 69999, mrp: 79900, discount: 12, delivery: "Free", deliveryDays: "Tomorrow",  badge: "Best Seller", storeUrl: "" },
      { platform: "Flipkart", price: 71999, mrp: 79900, discount: 10, delivery: "Free", deliveryDays: "2-3 days",  badge: "",            storeUrl: "" },
      { platform: "Croma",    price: 74999, mrp: 79900, discount: 6,  delivery: "Free", deliveryDays: "2-3 days",  badge: "",            storeUrl: "" },
    ],
  },
  {
    id: 2, name: "Sony WH-1000XM5 Wireless Headphones", emoji: "🎧",
    tags: ["sony", "headphones", "earphones", "audio", "wireless"],
    rating: "4.7", reviews: "32,100",
    features: ["Industry Leading ANC", "30 Hours Battery", "Multipoint Connection", "Hi-Res Audio"],
    prices: [
      { platform: "Amazon",   price: 24990, mrp: 34990, discount: 29, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller", storeUrl: "" },
      { platform: "Flipkart", price: 25999, mrp: 34990, discount: 26, delivery: "Free", deliveryDays: "2-3 days", badge: "",            storeUrl: "" },
      { platform: "Snapdeal", price: 23500, mrp: 34990, discount: 33, delivery: "₹99",  deliveryDays: "5-6 days", badge: "Deal",        storeUrl: "" },
    ],
  },
  {
    id: 3, name: "Nike Air Force 1 '07 White", emoji: "👟",
    tags: ["nike", "shoes", "sneakers", "footwear", "sports"],
    rating: "4.5", reviews: "5,430",
    features: ["Leather Upper", "Air-Sole Cushioning", "Rubber Outsole", "Iconic AF1 Design"],
    prices: [
      { platform: "Amazon",   price: 7495, mrp: 9295, discount: 19, delivery: "Free", deliveryDays: "Tomorrow",  badge: "",            storeUrl: "" },
      { platform: "Myntra",   price: 6995, mrp: 9295, discount: 25, delivery: "Free", deliveryDays: "2-3 days",  badge: "Best Seller", storeUrl: "" },
      { platform: "Meesho",   price: 6500, mrp: 9295, discount: 30, delivery: "₹40",  deliveryDays: "5-7 days",  badge: "",            storeUrl: "" },
    ],
  },
  {
    id: 4, name: "Samsung 55\" 4K Smart TV Crystal UHD", emoji: "📺",
    tags: ["samsung", "tv", "television", "smart tv", "4k"],
    rating: "4.4", reviews: "15,670",
    features: ["55\" Crystal 4K UHD", "PurColor Technology", "Tizen Smart OS", "Alexa Built-in"],
    prices: [
      { platform: "Amazon",   price: 42990, mrp: 74900, discount: 43, delivery: "Free", deliveryDays: "2-3 days", badge: "Deal of Day", storeUrl: "" },
      { platform: "Flipkart", price: 44990, mrp: 74900, discount: 40, delivery: "Free", deliveryDays: "3-4 days", badge: "",            storeUrl: "" },
      { platform: "Croma",    price: 46990, mrp: 74900, discount: 37, delivery: "Free", deliveryDays: "3-4 days", badge: "",            storeUrl: "" },
    ],
  },
  {
    id: 5, name: "Apple MacBook Air M2 8GB 256GB", emoji: "💻",
    tags: ["macbook", "apple", "laptop", "m2", "mac"],
    rating: "4.8", reviews: "8,760",
    features: ["M2 Chip 8-Core CPU", "13.6\" Liquid Retina", "18 Hours Battery", "MagSafe Charging"],
    prices: [
      { platform: "Amazon",   price: 89990, mrp: 114900, discount: 22, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller", storeUrl: "" },
      { platform: "Flipkart", price: 91990, mrp: 114900, discount: 20, delivery: "Free", deliveryDays: "2-3 days", badge: "",            storeUrl: "" },
      { platform: "Croma",    price: 94990, mrp: 114900, discount: 17, delivery: "Free", deliveryDays: "2-3 days", badge: "",            storeUrl: "" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
const fakeGraph = (basePrice) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((m) => ({ month: m, price: Math.round(basePrice * (0.88 + Math.random() * 0.25)) }));
};
const loadProducts = () => {
  try {
    const saved = localStorage.getItem("dealradar_products");
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
};
const saveProducts = (products) => {
  try { localStorage.setItem("dealradar_products", JSON.stringify(products)); } catch {}
};

// ── Input Style ───────────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "11px 13px", borderRadius: 9,
  border: "1px solid #222", background: "#0d0d18", color: "#eee",
  fontSize: 13, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", marginBottom: 10, display: "block",
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
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>🔍</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff" }}>DealRadar</h1>
          <p style={{ margin: "5px 0 0", color: "#3d3d55", fontSize: 13 }}>India ka smartest price comparison</p>
        </div>
        <div style={{ display: "flex", background: "#111", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {["login", "signup"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setErr(""); }}
              style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: tab === t ? "#1c1c2e" : "transparent", color: tab === t ? "#818cf8" : "#444" }}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>
        <div style={{ background: "#111", borderRadius: 14, padding: 22, border: "1px solid #1c1c2e" }}>
          {tab === "signup" && <input style={inp} placeholder="Tera naam" value={f.name} onChange={set("name")} />}
          <input style={inp} placeholder="Email" type="email" value={f.email} onChange={set("email")} />
          <input style={{ ...inp, marginBottom: err ? 6 : 14 }} placeholder="Password" type="password" value={f.pass}
            onChange={set("pass")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {err && <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 10px" }}>{err}</p>}
          <button onClick={submit} style={{
            width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "#fff", fontWeight: 800, fontSize: 15,
          }}>{tab === "login" ? "Log In →" : "Account Banao →"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
            <span style={{ color: "#333", fontSize: 11 }}>ya</span>
            <div style={{ flex: 1, height: 1, background: "#1c1c2e" }} />
          </div>
          <button onClick={() => onAuth({ name: "Guest", email: "" })} style={{
            width: "100%", padding: "12px 0", borderRadius: 10, border: "1px solid #1c1c2e",
            background: "transparent", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Guest ke taur pe continue karo</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ products, setProducts, onClose }) {
  const [view, setView] = useState("list"); // list | add | edit
  const [editProduct, setEditProduct] = useState(null);

  const deleteProduct = (id) => {
    if (!window.confirm("Delete karo?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090f", fontFamily: "'Segoe UI',sans-serif" }}>
      {/* Admin Nav */}
      <div style={{ background: "#0d0d18", borderBottom: "1px solid #1c1c2e", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        {view !== "list" ? (
          <button onClick={() => { setView("list"); setEditProduct(null); }}
            style={{ background: "none", border: "none", color: "#818cf8", fontSize: 22, cursor: "pointer", padding: 0 }}>‹</button>
        ) : (
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#818cf8", fontSize: 22, cursor: "pointer", padding: 0 }}>‹</button>
        )}
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>
          {view === "list" ? "⚙️ Admin Panel" : view === "add" ? "➕ Product Add Karo" : "✏️ Product Edit Karo"}
        </h2>
        {view === "list" && (
          <button onClick={() => setView("add")}
            style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 9, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Add Product
          </button>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ color: "#444", fontSize: 12, margin: "0 0 4px" }}>{products.length} products hain database mein</p>
            {products.map((p) => (
              <div key={p.id} style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{p.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#555" }}>{p.prices.length} platforms · {rupee(Math.min(...p.prices.map(x => x.price)))} se shuru</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditProduct(p); setView("edit"); }}
                    style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #4f46e5", background: "transparent", color: "#818cf8", fontSize: 12, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}
                    style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #7f1d1d", background: "transparent", color: "#f87171", fontSize: 12, cursor: "pointer" }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {(view === "add" || view === "edit") && (
          <ProductForm
            initial={editProduct}
            onSave={(product) => {
              let updated;
              if (editProduct) {
                updated = products.map((p) => p.id === product.id ? product : p);
              } else {
                updated = [...products, { ...product, id: Date.now() }];
              }
              setProducts(updated);
              saveProducts(updated);
              setView("list");
              setEditProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Product Form (Add / Edit) ─────────────────────────────────────────────────
function ProductForm({ initial, onSave }) {
  const blank = { name: "", emoji: "📦", tags: "", rating: "4.0", reviews: "0", features: ["", "", ""], prices: [] };
  const [form, setForm] = useState(initial || blank);
  const [newPrice, setNewPrice] = useState({ platform: "Amazon", price: "", mrp: "", discount: "", delivery: "Free", deliveryDays: "Tomorrow", badge: "", storeUrl: "" });
  const [err, setErr] = useState("");

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setFeature = (i, v) => {
    const feats = [...(form.features || ["", "", ""])];
    feats[i] = v;
    setField("features", feats);
  };

  const addPrice = () => {
    if (!newPrice.price || !newPrice.mrp) return setErr("Price aur MRP dalo");
    const disc = Math.round((newPrice.mrp - newPrice.price) / newPrice.mrp * 100);
    setForm((f) => ({ ...f, prices: [...(f.prices || []), { ...newPrice, price: Number(newPrice.price), mrp: Number(newPrice.mrp), discount: disc }] }));
    setNewPrice({ platform: "Amazon", price: "", mrp: "", discount: "", delivery: "Free", deliveryDays: "Tomorrow", badge: "", storeUrl: "" });
    setErr("");
  };

  const removePrice = (i) => setForm((f) => ({ ...f, prices: f.prices.filter((_, idx) => idx !== i) }));

  const save = () => {
    if (!form.name.trim()) return setErr("Product ka naam dalo");
    if (!form.prices || form.prices.length === 0) return setErr("Kam se kam ek platform ka price dalo");
    const tags = form.tags ? form.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : form.name.toLowerCase().split(" ");
    onSave({ ...form, tags, features: form.features.filter(Boolean) });
  };

  const sInp = { ...inp, marginBottom: 8 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Basic Info */}
      <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "14px", marginBottom: 12 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Basic Info</p>
        <input style={sInp} placeholder="Product ka naam *" value={form.name} onChange={e => setField("name", e.target.value)} />
        <input style={sInp} placeholder="Emoji (e.g. 📱)" value={form.emoji} onChange={e => setField("emoji", e.target.value)} />
        <input style={sInp} placeholder="Tags (comma separated: iphone, apple, mobile)" value={form.tags} onChange={e => setField("tags", e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...sInp, flex: 1 }} placeholder="Rating (e.g. 4.5)" value={form.rating} onChange={e => setField("rating", e.target.value)} />
          <input style={{ ...sInp, flex: 1 }} placeholder="Reviews (e.g. 5,230)" value={form.reviews} onChange={e => setField("reviews", e.target.value)} />
        </div>
      </div>

      {/* Features */}
      <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "14px", marginBottom: 12 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Key Features</p>
        {[0, 1, 2, 3].map((i) => (
          <input key={i} style={sInp} placeholder={`Feature ${i + 1}`} value={(form.features || [])[i] || ""} onChange={e => setFeature(i, e.target.value)} />
        ))}
      </div>

      {/* Add Platform Price */}
      <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "14px", marginBottom: 12 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Platform Prices</p>

        {/* Existing prices */}
        {(form.prices || []).map((px, i) => {
          const pl = PLATFORMS[px.platform];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: "#0d0d18", borderRadius: 8, padding: "8px 10px" }}>
              <span style={{ color: pl?.color || "#fff", fontWeight: 700, fontSize: 12, minWidth: 60 }}>{px.platform}</span>
              <span style={{ color: "#4ade80", fontWeight: 800, fontSize: 13 }}>{rupee(px.price)}</span>
              <span style={{ color: "#444", fontSize: 11 }}>MRP {rupee(px.mrp)}</span>
              <span style={{ color: "#f97316", fontSize: 11 }}>{px.discount}% off</span>
              <button onClick={() => removePrice(i)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          );
        })}

        {/* New price row */}
        <div style={{ background: "#0d0d18", borderRadius: 10, padding: 12, border: "1px dashed #1c1c2e", marginTop: 4 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#444" }}>Naya Platform Add Karo</p>
          <select value={newPrice.platform} onChange={e => setNewPrice(p => ({ ...p, platform: e.target.value }))}
            style={{ ...sInp, marginBottom: 8 }}>
            {PLATFORM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...sInp, flex: 1 }} placeholder="Price ₹" type="number" value={newPrice.price} onChange={e => setNewPrice(p => ({ ...p, price: e.target.value }))} />
            <input style={{ ...sInp, flex: 1 }} placeholder="MRP ₹" type="number" value={newPrice.mrp} onChange={e => setNewPrice(p => ({ ...p, mrp: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={newPrice.delivery} onChange={e => setNewPrice(p => ({ ...p, delivery: e.target.value }))}
              style={{ ...sInp, flex: 1 }}>
              <option>Free</option><option>₹40</option><option>₹99</option>
            </select>
            <select value={newPrice.deliveryDays} onChange={e => setNewPrice(p => ({ ...p, deliveryDays: e.target.value }))}
              style={{ ...sInp, flex: 1 }}>
              <option>Today</option><option>Tomorrow</option><option>2-3 days</option><option>4-5 days</option><option>5-7 days</option>
            </select>
          </div>
          <input style={sInp} placeholder="Visit Store URL (optional — seedha product link)" value={newPrice.storeUrl}
            onChange={e => setNewPrice(p => ({ ...p, storeUrl: e.target.value }))} />
          <input style={sInp} placeholder='Badge (e.g. "Best Seller", "Deal")' value={newPrice.badge}
            onChange={e => setNewPrice(p => ({ ...p, badge: e.target.value }))} />
          <button onClick={addPrice}
            style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", background: "#1c1c2e", color: "#818cf8", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Platform Add Karo
          </button>
        </div>
      </div>

      {err && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>{err}</p>}
      <button onClick={save}
        style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
        💾 Save Karo
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SEARCH RESULTS
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
              style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "14px", cursor: "pointer", display: "flex", gap: 14 }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4f46e5"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1c1c2e"}>
              <div style={{ width: 64, height: 64, background: "#1c1c2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#ddd", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.name}
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "#4ade80" }}>{rupee(minPrice)}</span>
                  <span style={{ fontSize: 11, color: "#555" }}>se shuru</span>
                  <span style={{ background: "#14532d", color: "#4ade80", padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>{maxOff}% tak off</span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {p.prices.map((px) => {
                    const pl = PLATFORMS[px.platform];
                    return pl ? (
                      <span key={px.platform} style={{ background: pl.bg, color: pl.color, border: `1px solid ${pl.color}44`, borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                        {pl.emoji} {px.platform}
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
//  PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function ProductDetail({ product }) {
  const [graphPlatform, setGraphPlatform] = useState(product.prices[0]?.platform);
  const graphData = fakeGraph(product.prices.find((p) => p.platform === graphPlatform)?.price || 10000);
  const minPrice = Math.min(...product.prices.map((p) => p.price));
  const sorted = [...product.prices].sort((a, b) => a.price - b.price);

  const getStoreUrl = (px) => {
    if (px.storeUrl && px.storeUrl.trim()) return px.storeUrl.trim();
    const pl = PLATFORMS[px.platform];
    return pl ? pl.url(product.name) : "#";
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Hero */}
      <div style={{ background: "#111", margin: "0 14px", borderRadius: "0 0 14px 14px", padding: "16px 14px 20px", borderBottom: "1px solid #1c1c2e" }}>
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

      {/* Price Comparison */}
      <div style={{ padding: "20px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Price Comparison</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((px, i) => {
            const pl = PLATFORMS[px.platform];
            if (!pl) return null;
            const isBest = px.price === minPrice;
            const savings = px.mrp - px.price;
            return (
              <div key={i} style={{ background: isBest ? "#0b1f0b" : "#111", borderRadius: 12, border: isBest ? "1.5px solid #4ade80" : "1px solid #1c1c2e", padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "#4ade80" : "#1c1c2e", color: i === 0 ? "#000" : "#555", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 14 }}>{pl.emoji}</span>
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
                  {savings > 0 && <span style={{ fontSize: 11, color: "#f97316" }}>₹{savings.toLocaleString()} bachenge MRP se</span>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: isBest ? "#4ade80" : "#fff", display: "block", marginBottom: 2 }}>{rupee(px.price)}</span>
                  <span style={{ fontSize: 11, color: "#444", textDecoration: "line-through", display: "block", marginBottom: 6 }}>{rupee(px.mrp)}</span>
                  <button onClick={() => window.open(getStoreUrl(px), "_blank")}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: pl.color, color: px.platform === "Amazon" ? "#000" : "#fff", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }}>
                    Visit Store →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price History */}
      <div style={{ padding: "24px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Price History (12 months)</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {sorted.map((px) => {
            const pl = PLATFORMS[px.platform];
            const active = graphPlatform === px.platform;
            return pl ? (
              <button key={px.platform} onClick={() => setGraphPlatform(px.platform)}
                style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 11, fontWeight: 700,
                  background: active ? pl.color : "transparent", color: active ? (px.platform === "Amazon" ? "#000" : "#fff") : pl.color, borderColor: pl.color }}>
                {px.platform}
              </button>
            ) : null;
          })}
        </div>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "16px 8px 8px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={graphData}>
              <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip contentStyle={{ background: "#1c1c2e", border: "none", borderRadius: 8, color: "#eee", fontSize: 12 }} formatter={(v) => [rupee(v), "Price"]} />
              <Line type="monotone" dataKey="price" stroke={PLATFORMS[graphPlatform]?.color || "#818cf8"} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[
            { label: "Lowest",  val: rupee(Math.min(...graphData.map(d => d.price))), color: "#4ade80" },
            { label: "Highest", val: rupee(Math.max(...graphData.map(d => d.price))), color: "#f87171" },
            { label: "Current", val: rupee(sorted.find(p => p.platform === graphPlatform)?.price || 0), color: "#818cf8" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 10, border: "1px solid #1c1c2e", padding: "10px 8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#444", marginBottom: 4 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "20px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Features</p>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "12px 14px" }}>
          {(product.features || []).map((feat, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < product.features.length - 1 ? "1px solid #1c1c2e" : "none" }}>
              <span style={{ color: "#4f46e5", fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 13, color: "#999" }}>{feat}</span>
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
  const [user, setUser]           = useState(null);
  const [products, setProducts]   = useState(loadProducts);
  const [inputVal, setInputVal]   = useState("");
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [searched, setSearched]   = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (!user) return <Auth onAuth={setUser} />;

  if (showAdmin) return (
    <AdminPanel products={products} setProducts={setProducts} onClose={() => setShowAdmin(false)} />
  );

  const search = () => {
    const q = inputVal.trim();
    if (!q) return;
    setQuery(q);
    setSelected(null);
    setSearched(true);
    const ql = q.toLowerCase();
    setResults(products.filter((p) =>
      (p.tags || []).some((t) => t.includes(ql) || ql.includes(t)) ||
      p.name.toLowerCase().includes(ql)
    ));
  };

  const PLATFORM_LIST = Object.entries(PLATFORMS).map(([name, v]) => ({ name, ...v, homeUrl: `https://www.${name.toLowerCase()}.in` }));
  const TRENDING = ["iPhone", "Nike Shoes", "Headphones", "Samsung TV", "Laptop", "Smartwatch"];

  return (
    <div style={{ minHeight: "100vh", maxWidth: 500, margin: "0 auto", background: "#09090f", color: "#e5e5e5", fontFamily: "'Segoe UI',sans-serif" }}>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#09090f", borderBottom: "1px solid #1c1c2e" }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          {selected ? (
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 22, padding: "0 4px 0 0", lineHeight: 1 }}>‹</button>
          ) : (
            <span style={{ fontSize: 20 }}>🔍</span>
          )}
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search — iPhone, Nike, Samsung TV..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: "1px solid #1c1c2e", background: "#111", color: "#eee", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={search} style={{ padding: "10px 16px", borderRadius: 9, border: "none", cursor: "pointer", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13 }}>
              Search
            </button>
          </div>
          {/* User + Admin */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setShowAdmin(true)} title="Admin Panel"
              style={{ background: "#1c1c2e", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⚙️
            </button>
            <div onClick={() => setUser(null)} title="Logout"
              style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", cursor: "pointer" }}>
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </div>
        {selected && (
          <div style={{ padding: "4px 14px 10px", display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ color: "#444", fontSize: 12, cursor: "pointer" }} onClick={() => setSelected(null)}>Results</span>
            <span style={{ color: "#333", fontSize: 12 }}>›</span>
            <span style={{ color: "#818cf8", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{selected.name}</span>
          </div>
        )}
      </div>

      {/* LANDING */}
      {!searched && !selected && (
        <div style={{ padding: "24px 14px 0" }}>
          <p style={{ color: "#444", fontSize: 11, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Seedha Platform Pe Jao</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
            {Object.entries(PLATFORMS).map(([name, pl]) => (
              <div key={name} onClick={() => window.open(`https://www.${name.toLowerCase()}.in`, "_blank")}
                style={{ background: pl.bg, border: `1px solid ${pl.color}33`, borderRadius: 14, padding: "14px 8px", textAlign: "center", cursor: "pointer", transition: "transform 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 4px 20px ${pl.color}44`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 26 }}>{pl.emoji}</div>
                <span style={{ color: pl.color, fontWeight: 800, fontSize: 11 }}>{name}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "#444", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Trending Searches</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {TRENDING.map((s) => (
              <button key={s} onClick={() => setInputVal(s)}
                style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #1c1c2e", background: "#111", color: "#666", cursor: "pointer", fontSize: 12 }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NO RESULTS */}
      {searched && !selected && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
          <p style={{ color: "#555", fontSize: 14 }}>"{query}" ke liye koi product nahi mila</p>
          <p style={{ color: "#333", fontSize: 12, marginTop: 6 }}>Admin panel (⚙️) se product add karo!</p>
        </div>
      )}

      {/* RESULTS */}
      {!selected && results.length > 0 && <SearchResults results={results} onSelect={setSelected} query={query} />}

      {/* DETAIL */}
      {selected && <ProductDetail product={selected} />}

      <style>{`* { box-sizing: border-box; } input, select { font-family: 'Segoe UI', sans-serif; } ::-webkit-scrollbar { display: none; } select { appearance: none; }`}</style>
    </div>
  );
}
