# 🇵🇰 Pakistan TikTok Trends

Pakistan mein trending TikTok **videos** aur **songs** dikhane wali web app.
Next.js par bani hai aur **Vercel + GitHub** par deploy hone ke liye ready hai.

- Bina API key ke bhi chalti hai (built-in sample data ke sath).
- RapidAPI key add karne par **real live Pakistan (PK) trending data** dikhati hai.

---

## 🚀 GitHub + Vercel par live kaise karein

### 1. GitHub par upload
1. GitHub par jaa kar ek **new repository** banayein (naam: `tiktok-pakistan-trends`).
2. Is folder ki saari files us repo mein upload karein
   (ya `git` se push karein — neeche commands hain).

```bash
git init
git add .
git commit -m "Pakistan TikTok Trends"
git branch -M main
git remote add origin https://github.com/USERNAME/tiktok-pakistan-trends.git
git push -u origin main
```

### 2. Vercel par deploy
1. https://vercel.com par login karein (GitHub se).
2. **Add New → Project** → apni GitHub repo import karein.
3. Framework: **Next.js** (Vercel khud detect kar lega).
4. **Deploy** daba dein. Bas! Aapki site live ho jayegi 🎉

---

## 🔑 Real (live) TikTok data kaise laayein — optional

Sample data ke bajaye asli trending data chahiye to:

1. https://rapidapi.com par account banayein.
2. Ek TikTok trending API subscribe karein, jaise:
   - **Tiktok Api** (`tiktok-api15.p.rapidapi.com`)
   - ya koi bhi TikTok trending API jo region (PK) support kare.
3. Apni **RapidAPI key** copy karein.
4. Vercel dashboard mein: **Project → Settings → Environment Variables** mein add karein:

   | Name           | Value                              |
   |----------------|------------------------------------|
   | `RAPIDAPI_KEY` | aapki rapidapi key                 |
   | `RAPIDAPI_HOST`| `tiktok-api15.p.rapidapi.com`      |

5. **Redeploy** karein. Ab app "● LIVE data" badge dikhayegi.

> Note: Har RapidAPI provider ka response thoda different hota hai.
> Agar aap ka chuna hua API alag fields deta hai to `app/api/trends/route.js`
> mein mapping thodi adjust karni pad sakti hai (comments mein guide hai).

---

## 🖥️ Local par chalane ke liye

```bash
npm install
npm run dev
```

Phir browser mein: http://localhost:3000

---

## 📁 Files
- `app/page.js` — frontend UI (videos + songs tabs)
- `app/api/trends/route.js` — serverless API (real ya sample data)
- `lib/sampleData.js` — demo data
- `app/globals.css` — styling
