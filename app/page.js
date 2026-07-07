"use client";

import { useEffect, useState, useCallback } from "react";

function fmt(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n || 0);
}
function tier(c) { return c >= 70 ? "high" : c >= 55 ? "mid" : "low"; }

export default function Home() {
  const [tab, setTab] = useState("categories");     // categories | songs
  const [sortKey, setSortKey] = useState("chance");
  const [overview, setOverview] = useState(null);
  const [openCat, setOpenCat] = useState(null);      // slug of opened category
  const [catData, setCatData] = useState(null);      // {category, videos}
  const [catLoading, setCatLoading] = useState(false);
  const [updated, setUpdated] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/trends", { cache: "no-store" });
      const json = await res.json();
      setOverview(json);
      setUpdated(json.updatedAt);
    } catch (e) { setOverview({ categories: [], songs: [] }); }
  }, []);

  const openCategory = useCallback(async (slug) => {
    setOpenCat(slug);
    setCatLoading(true);
    setCatData(null);
    try {
      const res = await fetch("/api/trends?category=" + slug, { cache: "no-store" });
      setCatData(await res.json());
    } catch (e) { setCatData({ videos: [] }); }
    finally { setCatLoading(false); }
  }, []);

  // initial load + DAILY auto-refresh (checks hourly, refetches when the day changes,
  // also refreshes when user returns to the tab)
  useEffect(() => {
    loadOverview();
    let lastDay = new Date().getUTCDate();
    const iv = setInterval(() => {
      const d = new Date().getUTCDate();
      if (d !== lastDay) { lastDay = d; loadOverview(); if (openCat) openCategory(openCat); }
    }, 60 * 60 * 1000); // check every hour
    const onFocus = () => loadOverview();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [loadOverview, openCategory, openCat]);

  const cats = overview?.categories || [];
  const sortedCats = [...cats].sort((a, b) => {
    if (sortKey === "chance") return b.chance - a.chance;
    if (sortKey === "views") return b.topViews - a.topViews;
    return b.trend - a.trend;
  });
  const songs = overview?.songs || [];

  return (
    <div className="container">
      <header className="header">
        <div className="flag">🇵🇰</div>
        <h1>Pakistan TikTok Trends</h1>
        <p>Har category jo Pakistan mein viral hai — category kholein aur latest viral videos dekhein</p>
        <div className="updated">
          <span className="live-dot" /> Auto-refresh: daily
          {updated && <> · Last updated {new Date(updated).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</>}
          <button className="refresh-mini" onClick={() => { loadOverview(); if (openCat) openCategory(openCat); }}>↻</button>
        </div>
      </header>

      <div className="tabs">
        <div className={"tab" + (tab === "categories" ? " active" : "")} onClick={() => { setTab("categories"); }}>📊 Categories</div>
        <div className={"tab" + (tab === "songs" ? " active" : "")} onClick={() => setTab("songs")}>🎵 Trending Songs</div>
      </div>

      {/* ---------- CATEGORIES ---------- */}
      {tab === "categories" && !openCat && (
        <>
          <div className="hero-note">
            <span className="hero-icon">🎯</span>
            <div>
              <strong>Viral Chance</strong>
              <span>Agar aap is category mein video banayein to viral hone ka % chance. Category par click karein → latest viral videos + views.</span>
            </div>
          </div>

          <div className="catsort">
            <span className="ctl-label">Sort:</span>
            <button className={"chip" + (sortKey === "chance" ? " active" : "")} onClick={() => setSortKey("chance")}>🎯 Viral Chance</button>
            <button className={"chip" + (sortKey === "views" ? " active" : "")} onClick={() => setSortKey("views")}>👁️ Views</button>
            <button className={"chip" + (sortKey === "trend" ? " active" : "")} onClick={() => setSortKey("trend")}>📈 Trending</button>
          </div>

          {!overview && <div className="loading"><div className="spinner" />Loading...</div>}

          <div className="grid">
            {sortedCats.map((c, i) => {
              const t = tier(c.chance);
              const up = c.trend >= 0;
              return (
                <button className="cat" key={c.slug} onClick={() => openCategory(c.slug)}>
                  <div className="cat-top">
                    <span className="emoji">{c.emoji}</span>
                    <span className="rankpill">#{i + 1}</span>
                  </div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-urdu">{c.urdu}</div>
                  <div className="chance-row">
                    <span className="chance-label">🎯 Viral chance</span>
                    <span className={"chance-val " + t}>{c.chance}%</span>
                  </div>
                  <div className="bar"><span className={t} style={{ width: c.chance + "%" }} /></div>
                  <div className="cat-stats">
                    <div className="cs"><div className="n">{fmt(c.topViews)}</div><div className="l">👁️ Top video</div></div>
                    <div className="cs"><div className={"n trend " + (up ? "up" : "down")}>{(up ? "▲+" : "▼") + Math.abs(c.trend)}%</div><div className="l">📈 Week</div></div>
                  </div>
                  <div className="see-more">Videos dekhein →</div>
                </button>
              );
            })}
          </div>

          <div className="legend">
            <span><i className="dot high" /> 70%+ Bohat easy</span>
            <span><i className="dot mid" /> 55–70% Achha</span>
            <span><i className="dot low" /> &lt;55% Mushkil</span>
          </div>
        </>
      )}

      {/* ---------- CATEGORY DETAIL (viral videos) ---------- */}
      {tab === "categories" && openCat && (
        <>
          <button className="back" onClick={() => { setOpenCat(null); setCatData(null); }}>← Saari categories</button>
          {catData?.category && (
            <div className="cat-header">
              <span className="emoji-lg">{catData.category.emoji}</span>
              <div>
                <h2>{catData.category.name}</h2>
                <span className="cat-sub">{catData.category.urdu} · 🎯 {catData.category.chance}% viral chance</span>
              </div>
              {catData.source === "live" && <span className="badge">● LIVE</span>}
            </div>
          )}

          {catLoading && <div className="loading"><div className="spinner" />Latest viral videos aa rahe hain...</div>}

          {!catLoading && catData && (
            <div className="grid">
              {catData.videos.map((v, i) => (
                <a className="vcard" key={v.id} href={v.link} target="_blank" rel="noreferrer">
                  <div className="thumb">
                    <img src={v.cover} alt={v.title} loading="lazy" />
                    <span className="rankpill">#{i + 1}</span>
                    <span className="play">▶ {fmt(v.views)}</span>
                  </div>
                  <div className="body">
                    <div className="title">{v.title}</div>
                    <div className="author">{v.author}</div>
                    <div className="music">🎵 {v.music}</div>
                    <div className="stats">
                      <span>❤️ {fmt(v.likes)}</span>
                      <span>💬 {fmt(v.comments)}</span>
                      <span>↗ {fmt(v.shares)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------- TRENDING SONGS ---------- */}
      {tab === "songs" && (
        <>
          <div className="hero-note">
            <span className="hero-icon">🎵</span>
            <div>
              <strong>Trending Songs — Pakistan</strong>
              <span>Sab se ziada use hone wale sounds. "Videos" = kitni videos mein yeh song laga hai.</span>
            </div>
          </div>
          {!overview && <div className="loading"><div className="spinner" />Loading songs...</div>}
          <div className="slist">
            {songs.map((s) => (
              <div className="srow" key={s.id}>
                <div className="rank">{s.rank}</div>
                <img src={s.cover} alt={s.title} loading="lazy" />
                <div className="info">
                  <div className="stitle">{s.title}</div>
                  <div className="sartist">{s.artist}</div>
                </div>
                <div className="song-meta">
                  <div className="scount">{fmt(s.videos)} videos</div>
                  <div className={"song-chance " + tier(s.chance)}>🎯 {s.chance}%</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="footer">
        Built with Next.js · Deployed on Vercel · Region: {overview?.region || "Pakistan"}
        <br />
        <span style={{ opacity: 0.6 }}>Live data ke liye Vercel mein RAPIDAPI_KEY environment variable add karein. Site daily khud refresh hoti hai.</span>
      </div>
    </div>
  );
}
