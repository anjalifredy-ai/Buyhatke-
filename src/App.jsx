import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = {
  Amazon:   { color: "#FF9900", bg: "#1a1000", url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  Flipkart: { color: "#2874F0", bg: "#00082a", url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  Meesho:   { color: "#F43397", bg: "#1a0010", url: (q) => `https://meesho.com/search?q=${encodeURIComponent(q)}` },
  Snapdeal: { color: "#E40046", bg: "#1a0008", url: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}` },
  Myntra:   { color: "#FF3F6C", bg: "#1a0010", url: (q) => `https://www.myntra.com/${encodeURIComponent(q)}` },
  Shopsy:   { color: "#F54D9E", bg: "#1a0018", url: (q) => `https://www.shopsy.in/search?q=${encodeURIComponent(q)}` },
  Croma:    { color: "#67AE3E", bg: "#091a06", url: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}` },
};

// ── Product Database ─────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "Apple iPhone 15 128GB Black", emoji: "📱",
    tags: ["iphone", "apple", "iphone 15", "mobile", "phone", "smartphone"],
    rating: "4.6", reviews: "21,430",
    features: ["6.1\" Super Retina XDR OLED", "48MP Main Camera", "A16 Bionic Chip", "USB-C Charging", "Dynamic Island"],
    prices: [
      { platform: "Amazon",   price: 69999, mrp: 79900, discount: 12, delivery: "Free", deliveryDays: "Tomorrow",  badge: "Best Seller" },
      { platform: "Flipkart", price: 71999, mrp: 79900, discount: 10, delivery: "Free", deliveryDays: "2-3 days",  badge: "" },
      { platform: "Croma",    price: 74999, mrp: 79900, discount: 6,  delivery: "Free", deliveryDays: "2-3 days",  badge: "" },
      { platform: "Snapdeal", price: 68500, mrp: 79900, discount: 14, delivery: "₹99", deliveryDays: "4-5 days",  badge: "Deal" },
    ],
  },
  {
    id: 2, name: "Apple iPhone 15 Pro 256GB Titanium", emoji: "📱",
    tags: ["iphone", "apple", "iphone 15 pro", "iphone pro", "mobile", "phone", "smartphone"],
    rating: "4.7", reviews: "14,210",
    features: ["6.1\" ProMotion 120Hz", "48MP Triple Camera System", "A17 Pro Chip", "Titanium Design", "Action Button"],
    prices: [
      { platform: "Amazon",   price: 119999, mrp: 134900, discount: 11, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 122999, mrp: 134900, discount: 9,  delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Croma",    price: 124999, mrp: 134900, discount: 7,  delivery: "Free", deliveryDays: "3-4 days", badge: "" },
    ],
  },
  {
    id: 3, name: "Samsung Galaxy S24 Ultra 256GB", emoji: "📱",
    tags: ["samsung", "galaxy", "s24", "s24 ultra", "mobile", "phone", "smartphone", "android"],
    rating: "4.6", reviews: "18,900",
    features: ["6.8\" Dynamic AMOLED 120Hz", "200MP Quad Camera", "Snapdragon 8 Gen 3", "S Pen Included", "5000mAh Battery"],
    prices: [
      { platform: "Amazon",   price: 109999, mrp: 129999, discount: 15, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 112999, mrp: 129999, discount: 13, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Croma",    price: 114999, mrp: 129999, discount: 11, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Snapdeal", price: 107500, mrp: 129999, discount: 17, delivery: "₹99", deliveryDays: "5-6 days", badge: "" },
    ],
  },
  {
    id: 4, name: "OnePlus 12 256GB Flowy Emerald", emoji: "📱",
    tags: ["oneplus", "oneplus 12", "mobile", "phone", "smartphone", "android"],
    rating: "4.5", reviews: "9,870",
    features: ["6.82\" LTPO AMOLED 120Hz", "50MP Hasselblad Triple Camera", "Snapdragon 8 Gen 3", "100W Fast Charging", "5400mAh Battery"],
    prices: [
      { platform: "Amazon",   price: 54999, mrp: 64999, discount: 15, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 56999, mrp: 64999, discount: 12, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Meesho",   price: 51000, mrp: 64999, discount: 22, delivery: "₹40", deliveryDays: "5-7 days", badge: "Trending" },
    ],
  },
  {
    id: 5, name: "Sony WH-1000XM5 Wireless Headphones", emoji: "🎧",
    tags: ["sony", "headphones", "wh1000xm5", "xm5", "earphones", "audio", "noise cancelling", "wireless"],
    rating: "4.7", reviews: "32,100",
    features: ["Industry Leading ANC", "30 Hours Battery", "Multipoint Connection", "Hi-Res Audio", "Speak-to-Chat"],
    prices: [
      { platform: "Amazon",   price: 24990, mrp: 34990, discount: 29, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 25999, mrp: 34990, discount: 26, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Croma",    price: 27990, mrp: 34990, discount: 20, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Snapdeal", price: 23500, mrp: 34990, discount: 33, delivery: "₹99", deliveryDays: "5-6 days", badge: "Deal" },
    ],
  },
  {
    id: 6, name: "boAt Rockerz 550 Wireless Headphones", emoji: "🎧",
    tags: ["boat", "headphones", "rockerz", "earphones", "audio", "wireless", "bluetooth"],
    rating: "4.2", reviews: "87,450",
    features: ["20 Hours Playback", "40mm Drivers", "Foldable Design", "Padded Earcups", "Voice Assistant Support"],
    prices: [
      { platform: "Amazon",   price: 1299, mrp: 4990, discount: 74, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 1399, mrp: 4990, discount: 72, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Meesho",   price: 999,  mrp: 4990, discount: 80, delivery: "₹40", deliveryDays: "5-7 days", badge: "Trending" },
      { platform: "Shopsy",   price: 1099, mrp: 4990, discount: 78, delivery: "₹40", deliveryDays: "4-6 days", badge: "" },
    ],
  },
  {
    id: 7, name: "Samsung 55\" 4K Smart TV Crystal UHD", emoji: "📺",
    tags: ["samsung", "tv", "television", "smart tv", "55 inch", "4k", "led", "samsung tv"],
    rating: "4.4", reviews: "15,670",
    features: ["55\" Crystal 4K UHD", "PurColor Technology", "AirSlim Design", "Tizen Smart OS", "Alexa Built-in"],
    prices: [
      { platform: "Amazon",   price: 42990, mrp: 74900, discount: 43, delivery: "Free", deliveryDays: "2-3 days", badge: "Deal of Day" },
      { platform: "Flipkart", price: 44990, mrp: 74900, discount: 40, delivery: "Free", deliveryDays: "3-4 days", badge: "" },
      { platform: "Croma",    price: 46990, mrp: 74900, discount: 37, delivery: "Free", deliveryDays: "3-4 days", badge: "" },
      { platform: "Snapdeal", price: 41500, mrp: 74900, discount: 45, delivery: "₹99", deliveryDays: "5-7 days", badge: "" },
    ],
  },
  {
    id: 8, name: "Nike Air Force 1 '07 White", emoji: "👟",
    tags: ["nike", "shoes", "sneakers", "air force", "footwear", "sports"],
    rating: "4.5", reviews: "5,430",
    features: ["Leather Upper", "Air-Sole Cushioning", "Rubber Outsole", "Iconic AF1 Design", "Available All Sizes"],
    prices: [
      { platform: "Amazon",   price: 7495, mrp: 9295, discount: 19, delivery: "Free", deliveryDays: "Tomorrow",  badge: "" },
      { platform: "Flipkart", price: 7695, mrp: 9295, discount: 17, delivery: "Free", deliveryDays: "2-3 days",  badge: "" },
      { platform: "Myntra",   price: 6995, mrp: 9295, discount: 25, delivery: "Free", deliveryDays: "2-3 days",  badge: "Best Seller" },
      { platform: "Meesho",   price: 6500, mrp: 9295, discount: 30, delivery: "₹40", deliveryDays: "5-7 days",  badge: "" },
    ],
  },
  {
    id: 9, name: "Levi's 511 Slim Fit Jeans Dark Blue", emoji: "👖",
    tags: ["levi", "levis", "jeans", "denim", "pants", "clothing", "fashion"],
    rating: "4.3", reviews: "12,890",
    features: ["Slim Fit", "Stretch Denim", "5-Pocket Styling", "Sits Below Waist", "Machine Washable"],
    prices: [
      { platform: "Myntra",   price: 2099, mrp: 3999, discount: 47, delivery: "Free", deliveryDays: "2-3 days", badge: "Best Seller" },
      { platform: "Amazon",   price: 2299, mrp: 3999, discount: 43, delivery: "Free", deliveryDays: "Tomorrow",  badge: "" },
      { platform: "Flipkart", price: 2199, mrp: 3999, discount: 45, delivery: "Free", deliveryDays: "2-3 days",  badge: "" },
      { platform: "Meesho",   price: 1799, mrp: 3999, discount: 55, delivery: "₹40", deliveryDays: "5-7 days",  badge: "Trending" },
    ],
  },
  {
    id: 10, name: "Apple MacBook Air M2 8GB 256GB", emoji: "💻",
    tags: ["macbook", "apple", "laptop", "macbook air", "m2", "mac"],
    rating: "4.8", reviews: "8,760",
    features: ["M2 Chip 8-Core CPU", "13.6\" Liquid Retina", "18 Hours Battery", "MagSafe Charging", "1080p FaceTime Camera"],
    prices: [
      { platform: "Amazon",   price: 89990, mrp: 114900, discount: 22, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 91990, mrp: 114900, discount: 20, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Croma",    price: 94990, mrp: 114900, discount: 17, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
    ],
  },
  {
    id: 11, name: "Dell Inspiron 15 Core i5 16GB 512GB SSD", emoji: "💻",
    tags: ["dell", "laptop", "inspiron", "computer", "notebook"],
    rating: "4.3", reviews: "6,540",
    features: ["Intel Core i5-1235U", "15.6\" FHD 120Hz", "16GB DDR4 RAM", "512GB NVMe SSD", "Windows 11 Home"],
    prices: [
      { platform: "Amazon",   price: 54990, mrp: 74990, discount: 27, delivery: "Free", deliveryDays: "Tomorrow", badge: "Deal of Day" },
      { platform: "Flipkart", price: 56990, mrp: 74990, discount: 24, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Snapdeal", price: 52000, mrp: 74990, discount: 31, delivery: "₹99", deliveryDays: "5-6 days", badge: "" },
    ],
  },
  {
    id: 12, name: "Adidas Ultraboost 22 Running Shoes", emoji: "👟",
    tags: ["adidas", "shoes", "ultraboost", "sneakers", "running", "footwear", "sports"],
    rating: "4.4", reviews: "3,210",
    features: ["Boost Midsole Cushioning", "Primeknit+ Upper", "Continental Rubber Outsole", "Linear Energy Push", "Reflective Details"],
    prices: [
      { platform: "Amazon",   price: 8999, mrp: 17999, discount: 50, delivery: "Free", deliveryDays: "Tomorrow", badge: "" },
      { platform: "Myntra",   price: 8499, mrp: 17999, discount: 53, delivery: "Free", deliveryDays: "2-3 days", badge: "Best Seller" },
      { platform: "Flipkart", price: 9199, mrp: 17999, discount: 49, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Meesho",   price: 7999, mrp: 17999, discount: 56, delivery: "₹40", deliveryDays: "5-7 days", badge: "Trending" },
    ],
  },
  {
    id: 13, name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L", emoji: "🍲",
    tags: ["instant pot", "pressure cooker", "cooker", "kitchen", "appliance"],
    rating: "4.5", reviews: "24,300",
    features: ["7-in-1 Multi Cooker", "6 Litre Capacity", "14 Smart Programs", "Delay Start Function", "Dishwasher Safe Parts"],
    prices: [
      { platform: "Amazon",   price: 6999, mrp: 12999, discount: 46, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 7299, mrp: 12999, discount: 44, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Snapdeal", price: 6500, mrp: 12999, discount: 50, delivery: "₹99", deliveryDays: "5-6 days", badge: "" },
    ],
  },
  {
    id: 14, name: "Noise ColorFit Pro 4 Smartwatch", emoji: "⌚",
    tags: ["smartwatch", "watch", "noise", "fitness", "wearable", "colorfit"],
    rating: "4.1", reviews: "43,200",
    features: ["1.72\" TFT Display", "100+ Watch Faces", "SpO2 & Heart Rate", "7 Day Battery", "IP68 Water Resistant"],
    prices: [
      { platform: "Amazon",   price: 1799, mrp: 6999, discount: 74, delivery: "Free", deliveryDays: "Tomorrow", badge: "Best Seller" },
      { platform: "Flipkart", price: 1899, mrp: 6999, discount: 73, delivery: "Free", deliveryDays: "2-3 days", badge: "" },
      { platform: "Meesho",   price: 1499, mrp: 6999, discount: 79, delivery: "₹40", deliveryDays: "5-7 days", badge: "Trending" },
      { platform: "Shopsy",   price: 1599, mrp: 6999, discount: 77, delivery: "₹40", deliveryDays: "4-6 days", badge: "" },
    ],
  },
  {
    id: 15, name: "Fire-Boltt Phoenix Pro Smartwatch", emoji: "⌚",
    tags: ["smartwatch", "watch", "fire boltt", "fitness", "wearable"],
    rating: "4.0", reviews: "29,870",
    features: ["1.39\" AMOLED Display", "Always On Display", "Bluetooth Calling", "100+ Sports Modes", "7 Day Battery"],
    prices: [
      { platform: "Amazon",   price: 1299, mrp: 5999, discount: 78, delivery: "Free", deliveryDays: "Tomorrow", badge: "" },
      { platform: "Flipkart", price: 1199, mrp: 5999, discount: 80, delivery: "Free", deliveryDays: "2-3 days", badge: "Best Seller" },
      { platform: "Meesho",   price: 999,  mrp: 5999, discount: 83, delivery: "₹40", deliveryDays: "5-7 days", badge: "Trending" },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

const fakeGraph = (basePrice) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((m) => ({
    month: m,
    price: Math.round(basePrice * (0.88 + Math.random() * 0.25)),
  }));
};

const searchProducts = (q) => {
  const query = q.toLowerCase().trim();
  return PRODUCTS.filter((p) =>
    p.tags.some((t) => t.includes(query) || query.includes(t)) ||
    p.name.toLowerCase().includes(query)
  );
};

// ── Auth Input style ──────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "13px 15px", borderRadius: 10,
  border: "1px solid #222", background: "#111", color: "#eee",
  fontSize: 14, outline: "none", boxSizing: "border-box",
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
              style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "14px", cursor: "pointer", display: "flex", gap: 14, transition: "border-color 0.15s" }}
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
//  PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function ProductDetail({ product, query }) {
  const [graphPlatform, setGraphPlatform] = useState(product.prices[0]?.platform);
  const graphData = fakeGraph(product.prices.find((p) => p.platform === graphPlatform)?.price || 10000);
  const minPrice = Math.min(...product.prices.map((p) => p.price));
  const sorted = [...product.prices].sort((a, b) => a.price - b.price);

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
              <div key={px.platform} style={{
                background: isBest ? "#0b1f0b" : "#111", borderRadius: 12,
                border: isBest ? "1.5px solid #4ade80" : "1px solid #1c1c2e",
                padding: "14px", display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "#4ade80" : "#1c1c2e",
                  color: i === 0 ? "#000" : "#555", fontWeight: 900, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
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
                  {savings > 0 && <span style={{ fontSize: 11, color: "#f97316" }}>₹{savings.toLocaleString()} bachenge MRP se</span>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ marginBottom: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: isBest ? "#4ade80" : "#fff" }}>{rupee(px.price)}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#444", textDecoration: "line-through", display: "block", marginBottom: 6 }}>{rupee(px.mrp)}</span>
                  <button onClick={() => window.open(pl.url(product.name), "_blank")}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                      background: pl.color, color: px.platform === "Amazon" ? "#000" : "#fff",
                      fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }}>
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
              <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} width={55}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip contentStyle={{ background: "#1c1c2e", border: "none", borderRadius: 8, color: "#eee", fontSize: 12 }}
                formatter={(v) => [rupee(v), "Price"]} />
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

      {/* Key Features */}
      <div style={{ padding: "20px 14px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Features</p>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #1c1c2e", padding: "12px 14px" }}>
          {product.features.map((feat, i) => (
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
  const [user, setUser]       = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);

  if (!user) return <Auth onAuth={setUser} />;

  const search = () => {
    const q = inputVal.trim();
    if (!q) return;
    setQuery(q);
    setSelected(null);
    setSearched(true);
    setResults(searchProducts(q));
  };

  const TRENDING = ["iPhone 15", "boAt Headphones", "Nike Shoes", "Samsung TV", "Smartwatch", "Laptop"];

  return (
    <div style={{ minHeight: "100vh", maxWidth: 500, margin: "0 auto", background: "#09090f", color: "#e5e5e5", fontFamily: "'Segoe UI',sans-serif" }}>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#09090f", borderBottom: "1px solid #1c1c2e" }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          {selected ? (
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 22, padding: "0 4px 0 0", lineHeight: 1 }}>‹</button>
          ) : (
            <span style={{ fontSize: 20 }}>🔍</span>
          )}
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search — iPhone, Nike, Samsung TV..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: "1px solid #1c1c2e",
                background: "#111", color: "#eee", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={search}
              style={{ padding: "10px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13 }}>
              Search
            </button>
          </div>
          <div onClick={() => setUser(null)} title="Logout"
            style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 13, color: "#fff", cursor: "pointer", flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
        </div>

        {selected && (
          <div style={{ padding: "4px 14px 10px", display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ color: "#444", fontSize: 12, cursor: "pointer" }} onClick={() => setSelected(null)}>Results</span>
            <span style={{ color: "#333", fontSize: 12 }}>›</span>
            <span style={{ color: "#818cf8", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
              {selected.name}
            </span>
          </div>
        )}
      </div>

      {/* LANDING */}
      {!searched && !selected && (
        <div style={{ textAlign: "center", padding: "60px 20px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
          <h2 style={{ color: "#fff", fontSize: 18, margin: "0 0 6px", fontWeight: 800 }}>Kya dhundhna hai?</h2>
          <p style={{ color: "#333", fontSize: 13, marginBottom: 24 }}>Amazon, Flipkart, Meesho — sabka price ek jagah</p>
          <p style={{ color: "#444", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Trending Searches</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {TRENDING.map((s) => (
              <button key={s} onClick={() => { setInputVal(s); }}
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
          <p style={{ color: "#333", fontSize: 12, marginTop: 6 }}>iPhone, Nike, Samsung TV, boAt, Laptop try karo</p>
        </div>
      )}

      {/* RESULTS */}
      {!selected && results.length > 0 && (
        <SearchResults results={results} onSelect={setSelected} query={query} />
      )}

      {/* DETAIL */}
      {selected && <ProductDetail product={selected} query={query} />}

      <style>{`
        * { box-sizing: border-box; }
        input { font-family: 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
