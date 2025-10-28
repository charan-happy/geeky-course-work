import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true })); // for form POSTs
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Connection management
redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("ready", () => console.log("🔆 Redis ready"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
redis.on("close", () => console.log("⚠️ Redis connection closed"));
redis.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));

// Sample "database"
const fakeDB = {
  user1: { name: "Alice", age: 25 },
  user2: { name: "Bob", age: 30 },
  user3: { name: "Charlie", age: 22 },
};

// Home page - shows UI with gradient, list of cached keys, and controls
app.get("/", async (req, res) => {
  try {
    // Get keys for demo (acceptable for small dev/demo usage)
    const keys = await redis.keys("*");
    const items = await Promise.all(
      keys.map(async (k) => {
        const v = await redis.get(k);
        return { key: k, value: v };
      })
    );

    res.send(`
      <html>
        <head>
          <title>Redis + Express Demo</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            :root {
              --card-bg: rgba(255,255,255,0.12);
              --accent: linear-gradient(90deg,#30cfd0,#330867);
              --muted: rgba(255,255,255,0.8);
            }
            *{box-sizing:border-box}
            body {
              margin: 0;
              font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              background: radial-gradient(1200px 600px at 10% 10%, rgba(255,255,255,0.04), transparent),
                          linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff7eb6 100%);
              color: #fff;
              padding: 40px 16px;
            }
            .wrap {
              width: 100%;
              max-width: 900px;
            }
            .card {
              background: var(--card-bg);
              border-radius: 14px;
              padding: 24px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.25);
              backdrop-filter: blur(6px);
              margin-bottom: 18px;
            }
            h1 { margin: 0 0 10px 0; font-size: 22px; letter-spacing: 0.2px; }
            p.lead { margin: 0 0 18px 0; color: var(--muted); }
            .row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
            .box {
              flex: 1 1 300px;
            }
            input[type="text"]{
              width:100%;
              padding:10px 12px;
              border-radius:8px;
              border:none;
              outline:none;
              background: rgba(255,255,255,0.06);
              color: #fff;
            }
            button {
              padding: 10px 16px;
              border-radius: 10px;
              border: none;
              cursor: pointer;
              background: var(--accent);
              color: #fff;
              font-weight: 600;
            }
            .list { margin-top: 12px; max-height: 300px; overflow:auto; }
            .item {
              display:flex;
              justify-content:space-between;
              gap:12px;
              padding:10px;
              border-radius:8px;
              background: rgba(0,0,0,0.12);
              margin-bottom:8px;
              align-items:center;
              font-size:14px;
            }
            .meta { color: rgba(255,255,255,0.85); font-weight:600; }
            .small { color: rgba(255,255,255,0.7); font-size:13px; }
            .danger { background: linear-gradient(90deg,#ff6b6b,#ff4757); border: none; }
            footer {
              margin-top: 20px;
              color: rgba(255,255,255,0.85);
              text-align:center;
              font-size:14px;
            }
            .footer-heart { color: #ff6b6b; margin-left:6px; }
            @media (max-width:600px) {
              .row { flex-direction:column; align-items:stretch; }
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <h1>Redis Caching Demo</h1>
              <p class="lead">This demo shows caching using Redis. Use the forms below to simulate DB read, cache deletion, and flush the Redis DB.</p>

              <div style="margin-bottom:12px;">
                <form action="/user/fetch" method="post" style="display:flex; gap:8px; flex-wrap:wrap;">
                  <input name="userId" type="text" placeholder="Enter user id (e.g. user1)" value="user1" required />
                  <button type="submit">Fetch (with cache)</button>
                </form>
              </div>

              <div style="margin-bottom:12px;">
                <form action="/cache/delete" method="post" style="display:flex; gap:8px; flex-wrap:wrap;">
                  <input name="key" type="text" placeholder="Cache key to delete (e.g. user1)" required />
                  <button type="submit">Delete Key</button>
                </form>
              </div>

              <div style="margin-bottom:6px;">
                <form action="/flush" method="post" onsubmit="return confirm('This will delete ALL keys in the Redis DB. Continue?');">
                  <button type="submit" class="danger">Flush DB (DELETE ALL KEYS)</button>
                </form>
              </div>

              <div class="list" aria-live="polite">
                <h3 style="margin-top:14px;">Cached Keys</h3>
                ${items.length ? items.map(i => `
                  <div class="item">
                    <div>
                      <div class="meta">${escapeHtml(i.key)}</div>
                      <div class="small">${escapeHtml(truncate(i.value || "", 120))}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <form action="/cache/delete" method="post" style="margin:0;">
                        <input type="hidden" name="key" value="${escapeHtml(i.key)}" />
                        <button type="submit">Delete</button>
                      </form>
                    </div>
                  </div>
                `).join("") : `<p class="small">No cached keys found.</p>`}
              </div>
            </div>

            <footer>
              built with <span class="footer-heart">❤️</span> by Nagacharan
            </footer>
          </div>

          <script>
            // helper functions used in template if needed client-side
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Failed to render home:", err);
    res.status(500).send("Failed to load page.");
  }
});

// Utility used in template to escape
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function truncate(s, n) {
  if (!s) return "";
  const t = s.length > n ? s.slice(0, n) + "…" : s;
  return t;
}

// POST /user/fetch - fetch user via cache (form-friendly)
app.post("/user/fetch", async (req, res) => {
  const userId = String(req.body.userId || "").trim();
  if (!userId) return res.redirect("/");

  try {
    // Check cache
    const cached = await redis.get(userId);
    if (cached) {
      // Redirect to home showing current caches (no separate display page)
      // You could instead return JSON; for demo we redirect to home.
      return res.redirect("/");
    }

    // Simulate DB lookup
    const userData = fakeDB[userId];
    if (!userData) {
      // store not found marker for short time to avoid repeated lookups (optional)
      await redis.set(userId, JSON.stringify({ error: "not_found" }), "EX", 10);
      return res.redirect("/");
    }

    // Cache for 60s
    await redis.set(userId, JSON.stringify(userData), "EX", 60);
    return res.redirect("/");
  } catch (err) {
    console.error("user fetch error:", err);
    return res.status(500).send("Server error");
  }
});

// POST /cache/delete - delete a specific key (form-friendly)
app.post("/cache/delete", async (req, res) => {
  const key = String(req.body.key || "").trim();
  if (!key) return res.redirect("/");
  try {
    await redis.del(key);
    return res.redirect("/");
  } catch (err) {
    console.error("delete key error:", err);
    return res.status(500).send("Failed to delete key");
  }
});

// POST /flush - flush current Redis DB
app.post("/flush", async (req, res) => {
  try {
    await redis.flushdb(); // clears current DB only
    console.log("⚠️ Redis DB flushed by request");
    return res.redirect("/");
  } catch (err) {
    console.error("Flush error:", err);
    return res.status(500).send("Failed to flush Redis DB");
  }
});

// Keep the JSON API-style endpoints too (existing)
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const cached = await redis.get(userId);
    if (cached) return res.json({ source: "cache", data: JSON.parse(cached) });

    const userData = fakeDB[userId];
    if (!userData) return res.status(404).json({ message: "User not found" });

    await redis.set(userId, JSON.stringify(userData), "EX", 60);
    return res.json({ source: "database", data: userData });
  } catch (err) {
    console.error("GET /user/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/cache/:key", async (req, res) => {
  try {
    await redis.del(req.params.key);
    return res.json({ message: "deleted" });
  } catch (err) {
    console.error("delete api error:", err);
    return res.status(500).json({ message: "Failed" });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
