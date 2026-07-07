import { categories, videosForCategory, trendingSongs } from "../../../lib/data";

// Vercel serverless API. Endpoints:
//   GET /api/trends                  -> { categories:[{...meta, topViews}], songs:[...] }
//   GET /api/trends?category=comedy  -> { category, videos:[...] }
//   GET /api/trends?type=songs       -> { songs:[...] }
//
// Data har request par regenerate hoti hai (force-dynamic) aur date se seed hoti
// hai, is liye har din khud refresh ho jati hai. RAPIDAPI_KEY set ho to real
// Pakistan (PK) data laane ki koshish karta hai.

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REGION = "PK";

async function fetchRealCategoryVideos(slug) {
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST || "tiktok-api15.p.rapidapi.com";
  if (!key) return null;
  const cat = categories.find((c) => c.slug === slug);
  const keyword = cat ? cat.name.split(" ")[0] : slug;
  try {
    const res = await fetch(
      `https://${host}/index/Tiktok/searchVideoListByKeywords?keywords=${encodeURIComponent(
        keyword + " pakistan"
      )}&region=${REGION}&count=12`,
      { headers: { "x-rapidapi-key": key, "x-rapidapi-host": host }, cache: "no-store" }
    );
    if (!res.ok) throw new Error("status " + res.status);
    const json = await res.json();
    const raw = json?.data?.videos || json?.data?.aweme_list || json?.videos || [];
    const videos = (raw || []).slice(0, 12).map((it, i) => ({
      id: it.video_id || it.aweme_id || slug + i,
      title: it.title || it.desc || cat?.name + " video",
      author: "@" + (it.author?.unique_id || it.author?.nickname || "tiktok"),
      cover: it.cover || it.origin_cover || it.video?.cover || `https://picsum.photos/seed/${slug}${i}/300/400`,
      views: Number(it.play_count || it.statistics?.play_count || 0),
      likes: Number(it.digg_count || it.statistics?.digg_count || 0),
      comments: Number(it.comment_count || it.statistics?.comment_count || 0),
      shares: Number(it.share_count || it.statistics?.share_count || 0),
      link: it.share_url || it.link || "https://www.tiktok.com/",
      music: it.music?.title || "Original Sound",
    }));
    return videos.length ? videos : null;
  } catch (e) {
    console.error("RapidAPI category error:", e.message);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("category");
  const type = searchParams.get("type");
  const updatedAt = new Date().toISOString();

  if (slug) {
    const cat = categories.find((c) => c.slug === slug) || null;
    const real = await fetchRealCategoryVideos(slug);
    const videos = real || videosForCategory(slug);
    return Response.json({
      category: cat,
      videos,
      source: real ? "live" : "sample",
      updatedAt,
    });
  }

  if (type === "songs") {
    return Response.json({ songs: trendingSongs(), source: "sample", updatedAt });
  }

  // Overview: categories with a headline "topViews" (biggest video in category)
  const cats = categories.map((c) => {
    const vids = videosForCategory(c.slug);
    const totalViews = vids.reduce((s, v) => s + v.views, 0);
    return { ...c, topViews: vids[0]?.views || 0, totalViews, videoCount: vids.length };
  });

  return Response.json({
    categories: cats,
    songs: trendingSongs(),
    source: process.env.RAPIDAPI_KEY ? "live-ready" : "sample",
    region: "Pakistan",
    updatedAt,
  });
}
