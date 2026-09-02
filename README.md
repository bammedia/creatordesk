# CreatorDesk

Self-serve influencer booking platform. Brands pick a monthly plan, submit a
campaign brief, and get matched with vetted creators. Includes a free-trial
capture, a "join as a creator" roster form, a contact form, and a full-service
agency page linking to bammedia.us.

Built with React + Vite + Tailwind CSS.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) (version 18 or newer) installed first.

```bash
npm install     # install dependencies (first time only)
npm run dev     # start the local dev server
```

Open the URL it prints (usually http://localhost:5173).

```bash
npm run build   # create the production build in /dist
npm run preview # preview that production build locally
```

---

## Put the code on GitHub

1. Create a new **empty** repository on github.com (no README, no .gitignore —
   this project already has them). Copy the repo URL it gives you.

2. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Your code now lives on GitHub. Every future change: `git add .`,
`git commit -m "what changed"`, `git push`.

---

## Make it live with Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New → Project**, then import the repo you just pushed.
3. Vercel auto-detects Vite. Leave the defaults and click **Deploy**.
4. In ~1 minute you get a live URL like `your-repo.vercel.app`.

From then on, every `git push` to GitHub redeploys the site automatically.
To use your own domain, add it under the project's **Settings → Domains**.

---

## What still needs wiring up

The three forms (free trial, creator signup, contact) currently show a success
message but don't send the data anywhere yet. To actually receive leads, connect
each form to one of:

- **HubSpot forms** (you have an account) — embed or post to a HubSpot form so
  every submission becomes a contact in your CRM.
- A form service like **Formspree** or **Web3Forms** — quickest option, emails
  you each submission.
- Your own backend/API — most flexible, more work.

The paid plan flow (dashboard, bookings) uses in-memory demo data. Turning that
into a real product with logins, saved briefs, billing (Stripe), and an admin
side to manage bookings is the next build phase.
