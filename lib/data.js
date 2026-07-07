// Central data layer for Pakistan TikTok Trends
// - categories (meta + viral chance)
// - per-category viral videos (seeded by DATE -> "daily refresh" feel)
// - trending songs
//
// Jab RAPIDAPI_KEY set ho to route.js real data use karta hai; warna yeh
// deterministic-per-day sample data serve hota hai (har din thoda change).

export const categories = [
  { slug: "comedy",    emoji: "😂", name: "Comedy & Skits",         urdu: "کامیڈی",             chance: 89, trend: 12, creators: ["@thelahoriboy", "@comedy.pk", "@funny.desi", "@shehr.e.hansi"] },
  { slug: "food",      emoji: "🍲", name: "Food & Cooking",         urdu: "کھانا",              chance: 82, trend: 9,  creators: ["@foodie.pk", "@dhaba.life", "@karachi.eats", "@village.kitchen"] },
  { slug: "dance",     emoji: "💃", name: "Dance",                   urdu: "ڈانس",               chance: 76, trend: 7,  creators: ["@dance.desi", "@mehndi.moves", "@dholak.beats", "@bhangra.pk"] },
  { slug: "pranks",    emoji: "😲", name: "Pranks & Challenges",     urdu: "پرینک",              chance: 73, trend: 8,  creators: ["@prankstar.pk", "@challenge.gang", "@wild.pranks", "@street.dares"] },
  { slug: "cricket",   emoji: "🏏", name: "Cricket & Sports",        urdu: "کرکٹ",               chance: 71, trend: 14, creators: ["@gully.cricket", "@sixer.pk", "@sports.corner", "@cric.fever"] },
  { slug: "music",     emoji: "🎵", name: "Music & Songs",           urdu: "میوزک",              chance: 68, trend: 4,  creators: ["@coke.covers", "@lofi.pk", "@singer.diaries", "@street.singers"] },
  { slug: "drama",     emoji: "🎭", name: "Drama & Acting",          urdu: "ڈرامہ",              chance: 66, trend: 5,  creators: ["@dramabaaz", "@acting.clips", "@dialogue.king", "@sad.scenes"] },
  { slug: "vlogs",     emoji: "🎥", name: "Vlogs & Daily Life",      urdu: "والاگ",              chance: 64, trend: 6,  creators: ["@daily.vlogs.pk", "@ktown.diaries", "@isb.explorer", "@routine.life"] },
  { slug: "islamic",   emoji: "🕌", name: "Islamic & Motivational",  urdu: "اسلامی",             chance: 61, trend: 10, creators: ["@noor.reminders", "@motivate.pk", "@islamic.vibes", "@daily.dua"] },
  { slug: "beauty",    emoji: "💄", name: "Beauty & Makeup",         urdu: "میک اپ",             chance: 59, trend: 3,  creators: ["@glam.by.zoya", "@makeup.pk", "@bridal.looks", "@skincare.desi"] },
  { slug: "pets",      emoji: "🐾", name: "Pets & Animals",          urdu: "جانور",              chance: 57, trend: 5,  creators: ["@billi.official", "@pets.of.pk", "@cute.paws", "@farm.animals"] },
  { slug: "fashion",   emoji: "👗", name: "Fashion & Style",         urdu: "فیشن",               chance: 55, trend: 2,  creators: ["@style.pk", "@outfit.ideas", "@thrift.finds", "@desi.fashion"] },
  { slug: "education", emoji: "📚", name: "Education & Tips",         urdu: "تعلیم",              chance: 52, trend: 6,  creators: ["@study.hacks.pk", "@english.tips", "@career.guide", "@gk.master"] },
  { slug: "gaming",    emoji: "🎮", name: "Gaming",                   urdu: "گیمنگ",              chance: 48, trend: -2, creators: ["@pubg.pk", "@gamer.zone", "@ff.highlights", "@stream.clips"] },
  { slug: "travel",    emoji: "✈️", name: "Travel",                  urdu: "سفر",                chance: 44, trend: 1,  creators: ["@travel.pk", "@northern.areas", "@backpacker.pk", "@hunza.diaries"] },
];

// Title templates per category (Pakistan-flavoured)
const TITLES = {
  comedy:    ["Jab ammi ghar aayi 😂", "Desi friends be like 🤣", "Rishtey wali aunty 😭", "School vs University life", "Load shedding comedy 💡", "Chai time drama ☕"],
  food:      ["Rs.100 mein full biryani? 🍛", "Lahori nihari ASMR 🔥", "Street gol gappay 🌶️", "Karahi banane ka asli tarika", "Chai paratha nashta ☕", "Village desi ghee cooking"],
  dance:     ["Mehndi night dhamaka 💃", "Pasoori dance trend 🔥", "Bhangra on the roof", "Wedding entry moves ✨", "Dholki beats challenge 🥁", "Bollywood x Coke Studio mix"],
  pranks:    ["Fake snake prank 😱", "Public reaction test", "Friend ko dara diya 😂", "Free food prank 🍔", "Wrong number prank 📞", "Scooter prank in Saddar"],
  cricket:   ["Gully cricket last over 🏏", "No-look six 😮", "Tape ball yorker special", "Street bowling action", "Kid vs pro batsman", "Match winning catch 🙌"],
  music:     ["Pasoori cover 🎶", "Lofi Urdu vibes 🌙", "Street singer ne dil jeet liya", "Coke Studio mashup", "Guitar + ghazal 🎸", "Naat sharif — subhanallah"],
  drama:     ["Emotional maa beta scene 😢", "Powerful monologue 🎭", "Sas bahu drama clip", "Classic dialogue delivery", "Sad breakup scene 💔", "Court room twist"],
  vlogs:     ["Day in Karachi 🌆", "Morning routine of a student", "Hostel life reality", "Islamabad market tour 🛍️", "24 hrs on Rs.500 challenge", "Village life vlog 🌾"],
  islamic:   ["Jummah Mubarak reminder 🕌", "Small dua, big reward", "Motivation for hard times", "Quran recitation — dil ko sukoon", "Kindness challenge ❤️", "Fajr wake up motivation"],
  beauty:    ["Bridal makeup transformation 💄", "5 min everyday look", "Skincare for Pakistani skin", "Cheap vs expensive foundation", "Mehndi design tutorial ✋", "Glow up before Eid ✨"],
  pets:      ["Billi ki funny reaction 🐱", "Rescued street puppy 🐶", "Talking parrot 🦜", "Farm goat vlog 🐐", "Cat vs cucumber 😹", "Loyal dog waits at gate"],
  fashion:   ["Eid outfit ideas 👗", "Thrift haul under Rs.2000", "Shalwar kameez styling", "Winter layering desi style", "Wedding guest looks ✨", "Sneaker collection tour 👟"],
  education: ["IELTS speaking tips 🗣️", "Study smart not hard 📚", "Free courses for students", "English grammar hack", "CSS preparation guide", "GK questions of Pakistan 🇵🇰"],
  gaming:    ["PUBG mobile clutch 🎮", "Free Fire 1v4 highlights", "Rank push montage", "Funny gaming fails 😂", "Best sensitivity settings", "Squad wipe moment 🔥"],
  travel:    ["Hunza valley beauty ✈️", "Northern areas road trip 🏔️", "Naran Kaghan guide", "Fairy Meadows trek ⛰️", "Karachi to Skardu by road", "Budget travel Pakistan tips"],
};

// Deterministic pseudo-random based on a numeric seed
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function dateSeed(extra = 0) {
  const d = new Date();
  const key = d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return key + extra;
}

// Build viral videos for one category, seeded by today's date.
export function videosForCategory(slug) {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return [];
  const titles = TITLES[slug] || ["Trending clip"];
  const rand = seeded(dateSeed(slug.length * 97 + slug.charCodeAt(0)));

  const list = titles.map((title, i) => {
    const base = 400000 + Math.floor(rand() * 6000000);
    const views = base + Math.floor((cat.chance / 100) * 2500000);
    const likes = Math.floor(views * (0.06 + rand() * 0.08));
    return {
      id: `${slug}-${i}`,
      title,
      author: cat.creators[i % cat.creators.length],
      cover: `https://picsum.photos/seed/${slug}${i}${dateSeed()}/300/400`,
      views,
      likes,
      comments: Math.floor(likes * (0.02 + rand() * 0.05)),
      shares: Math.floor(likes * (0.05 + rand() * 0.1)),
      link: "https://www.tiktok.com/",
      music: SONGS[i % SONGS.length].title + " - " + SONGS[i % SONGS.length].artist,
    };
  });
  return list.sort((a, b) => b.views - a.views);
}

// Trending songs (seeded daily for order/counts)
const SONGS = [
  { title: "Pasoori",          artist: "Ali Sethi & Shae Gill" },
  { title: "Kana Yaari",       artist: "Kaifi Khalil" },
  { title: "Groove Mera",      artist: "Young Stunners" },
  { title: "Tu Jhoom",         artist: "Naseebo Lal & Abida Parveen" },
  { title: "Kahani Suno 2.0",  artist: "Kaifi Khalil" },
  { title: "Jhol",             artist: "Maanu & Annural Khalid" },
  { title: "Sohni Lagdi",      artist: "Guru Randhawa" },
  { title: "Baddua",           artist: "Ali Zafar" },
  { title: "Tera Woh Pyar",    artist: "Momina Mustehsan" },
  { title: "Bewafa",           artist: "Imran Khan" },
  { title: "Sajni",            artist: "Arijit Singh x Ali Sethi" },
  { title: "Dil Ruba",         artist: "Asim Azhar" },
];

export function trendingSongs() {
  const rand = seeded(dateSeed(31));
  return SONGS
    .map((s, i) => ({
      id: "song-" + i,
      title: s.title,
      artist: s.artist,
      cover: `https://picsum.photos/seed/song${i}${dateSeed()}/200/200`,
      videos: 120000 + Math.floor(rand() * 800000),
      chance: 40 + Math.floor(rand() * 55),
    }))
    .sort((a, b) => b.videos - a.videos)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function lastUpdatedLabel() {
  return new Date().toISOString();
}
