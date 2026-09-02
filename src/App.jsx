import React, { useState, useMemo } from "react";
import {
  Check, ChevronRight, Building2, Target, Users, Calendar,
  Pencil, X, Plus, ArrowLeft, Sparkles, Package, Store, Clock,
  Instagram, Mail, Phone, ArrowUpRight, Megaphone, Menu,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 250,
    min: 2, max: 3,
    label: "2–3 influencers / month",
    blurb: "Test the waters with a steady trickle of creators.",
  },
  {
    id: "growth",
    name: "Growth",
    price: 450,
    min: 4, max: 6,
    label: "4–6 influencers / month",
    blurb: "A consistent content stream that keeps you in feeds.",
  },
  {
    id: "scale",
    name: "Scale",
    price: 750,
    min: 7, max: 9,
    label: "7–9 influencers / month",
    blurb: "Maximum reach — dominate your niche every month.",
  },
];

const INDUSTRIES = [
  "Restaurant / Food & Beverage", "Beauty & Skincare", "Fashion & Apparel",
  "Fitness & Wellness", "Home & Lifestyle", "Tech & Gadgets",
  "Travel & Hospitality", "Health & Supplements", "Automotive",
  "Finance & Services", "Entertainment", "Other",
];

const FULFILLMENT = [
  { id: "ship", label: "Ship product to creator", icon: Package },
  { id: "instore", label: "Have them visit / in-person", icon: Store },
  { id: "either", label: "Either works", icon: Sparkles },
];

const AGENCY_URL = "https://bammedia.us";

// Web3Forms — submissions email to jake@bammediagroup.us
const WEB3FORMS_KEY = "fafabfb2-d493-420c-bcdf-ad22a65f6b66";

async function sendToEmail(fields, subject) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: "CreatorDesk",
      ...fields,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Submission failed");
  return data;
}

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter / X", "Facebook", "Other"];
const CREATOR_NICHES = [
  "Food & Dining", "Beauty", "Fashion", "Fitness", "Lifestyle",
  "Tech", "Travel", "Family / Parenting", "Comedy", "Other",
];

const STATUS = {
  sourcing:  { label: "Sourcing",       tone: "slate" },
  proposed:  { label: "Awaiting your OK", tone: "yellow" },
  confirmed: { label: "Confirmed",       tone: "green" },
  scheduled: { label: "Scheduled by you", tone: "blue" },
};

// ─────────────────────────────────────────────────────────────
// Seed booking data (what your team fills in behind the scenes)
// ─────────────────────────────────────────────────────────────
const SEED = [
  { id: 1, handle: "@maya.eats",      niche: "Food",     followers: "48k", status: "proposed" },
  { id: 2, handle: "@thecitylook",    niche: "Fashion",  followers: "112k", status: "confirmed" },
  { id: 3, handle: "@dailygrind.co",  niche: "Lifestyle",followers: "31k", status: "sourcing" },
  { id: 4, handle: "@fitwithjordan",  niche: "Fitness",  followers: "88k", status: "scheduled" },
];

// ─────────────────────────────────────────────────────────────
// Small UI atoms
// ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const s = STATUS[status];
  const map = {
    slate:  "bg-slate-200 text-slate-700",
    yellow: "bg-gold text-ink",
    green:  "bg-emerald-200 text-emerald-900",
    blue:   "bg-sky-200 text-sky-900",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${map[s.tone]}`}>
      {s.label}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

// ─────────────────────────────────────────────────────────────
// Free trial banner — one influencer, free
// ─────────────────────────────────────────────────────────────
function FreeTrial() {
  const [f, setF] = useState({ company: "", email: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.company && f.email;

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await sendToEmail(
        { company: f.company, email: f.email, form: "Free Trial" },
        `New free-trial request from ${f.company}`
      );
      setSent(true);
    } catch (e) {
      setErr("Something went wrong. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gold bg-gold/10 p-6 sm:p-8">
      {sent ? (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold">
            <Check size={24} className="text-ink" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">You're booked in</p>
            <p className="text-sm text-slate-600">
              We'll line up one free influencer for {f.company} and email {f.email} with the details.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-gold">
              FREE TRIAL
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">
              Try it with one influencer, free.
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">
              Enter your email and company and we'll book you one free influencer —
              no plan, no card required.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3">
            <input className={inputCls} value={f.company} onChange={set("company")} placeholder="Company name" />
            <input className={inputCls} value={f.email} onChange={set("email")} placeholder="Work email" />
            <button
              disabled={!valid || busy}
              onClick={submit}
              className="rounded-xl bg-ink py-3 font-semibold text-white transition enabled:hover:bg-[#1f2740] disabled:opacity-40"
            >
              {busy ? "Sending…" : "Claim my free influencer"}
            </button>
            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Landing / Tier select
// ─────────────────────────────────────────────────────────────
function TierSelect({ onPick }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-gold">
          <Sparkles size={13} /> Self-serve influencer bookings
        </div>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink">
          Creators on tap.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Pick a plan, tell us about your brand, and we book vetted influencers
          for you every month. It's that simple.
        </p>
      </div>

      <div className="mt-10">
        <FreeTrial />
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t)}
            className="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-ink hover:shadow-[0_12px_40px_-12px_rgba(20,26,46,0.35)]"
          >
            {t.id === "growth" && (
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-ink">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-ink">${t.price}</span>
              <span className="text-sm text-slate-500">/mo</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-700">{t.label}</p>
            <p className="mt-3 text-sm text-slate-500">{t.blurb}</p>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:gap-2.5 transition-all">
              Choose {t.name} <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-400">
        All plans: vetted creators only · cancel anytime · we book & confirm, you schedule.
      </p>

      <div className="mt-16">
        <AgencyPanel />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Onboarding form
// ─────────────────────────────────────────────────────────────
function Onboarding({ tier, initial, onBack, onSubmit }) {
  const [f, setF] = useState(
    initial || {
      company: "", website: "", industry: INDUSTRIES[0],
      city: "", contactName: "", email: "",
      campaignGoal: "", audience: "", vibe: "",
      fulfillment: "either", notes: "",
    }
  );
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.company && f.email && f.contactName;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink">
        <ArrowLeft size={16} /> Change plan
      </button>

      <div className="mb-8 flex items-center justify-between rounded-2xl bg-ink p-5 text-white">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gold">Selected plan</p>
          <p className="font-display text-xl font-bold">{tier.name} — {tier.label}</p>
        </div>
        <p className="font-display text-2xl font-bold">${tier.price}<span className="text-sm font-normal text-slate-300">/mo</span></p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-ink" />
            <h2 className="font-display text-lg font-bold text-ink">Company details</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name *"><input className={inputCls} value={f.company} onChange={set("company")} placeholder="Acme Co." /></Field>
            <Field label="Website / IG"><input className={inputCls} value={f.website} onChange={set("website")} placeholder="acme.com" /></Field>
            <Field label="Industry">
              <select className={inputCls} value={f.industry} onChange={set("industry")}>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="City / market"><input className={inputCls} value={f.city} onChange={set("city")} placeholder="Los Angeles, CA" /></Field>
            <Field label="Contact name *"><input className={inputCls} value={f.contactName} onChange={set("contactName")} placeholder="Jane Doe" /></Field>
            <Field label="Email *"><input className={inputCls} value={f.email} onChange={set("email")} placeholder="jane@acme.com" /></Field>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Target size={18} className="text-ink" />
            <h2 className="font-display text-lg font-bold text-ink">Campaign brief</h2>
          </div>
          <div className="space-y-4">
            <Field label="What's the goal this month?">
              <input className={inputCls} value={f.campaignGoal} onChange={set("campaignGoal")} placeholder="Drive foot traffic to our new downtown location" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Target audience"><input className={inputCls} value={f.audience} onChange={set("audience")} placeholder="Women 25–40, local, active on IG" /></Field>
              <Field label="Content vibe"><input className={inputCls} value={f.vibe} onChange={set("vibe")} placeholder="Bright, authentic, day-in-the-life" /></Field>
            </div>
            <Field label="How do you want to work with creators?">
              <div className="grid gap-3 sm:grid-cols-3">
                {FULFILLMENT.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setF({ ...f, fulfillment: id })}
                    className={`flex flex-col items-start gap-2 rounded-xl border-2 p-3.5 text-left transition ${
                      f.fulfillment === id ? "border-ink bg-ink/[0.03]" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon size={18} className="text-ink" />
                    <span className="text-sm font-medium text-ink">{label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Anything else we should know?">
              <textarea className={`${inputCls} min-h-[90px] resize-y`} value={f.notes} onChange={set("notes")} placeholder="Dietary/product restrictions, must-avoid competitors, key dates…" />
            </Field>
          </div>
        </section>

        <button
          disabled={!valid}
          onClick={() => onSubmit(f)}
          className="w-full rounded-xl bg-ink py-3.5 font-semibold text-white transition enabled:hover:bg-[#1f2740] disabled:opacity-40"
        >
          {initial ? "Save changes" : `Start ${tier.name} — $${tier.price}/mo`}
        </button>
        {!valid && <p className="text-center text-xs text-slate-400">Company, contact name, and email are required.</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Dashboard
// ─────────────────────────────────────────────────────────────
function Dashboard({ tier, brief, bookings, onEditBrief, onChangeTier }) {
  const filled = bookings.length;
  const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  const counts = useMemo(() => {
    const confirmed = bookings.filter((b) => ["confirmed", "scheduled"].includes(b.status)).length;
    const pending = bookings.filter((b) => b.status === "proposed").length;
    return { confirmed, pending };
  }, [bookings]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{brief.company} · {monthLabel}</p>
          <h1 className="font-display text-3xl font-bold text-ink">Your bookings</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white">
          <div>
            <p className="text-xs text-gold">{tier.name} plan</p>
            <p className="font-display font-bold">{tier.label}</p>
          </div>
          <button onClick={onChangeTier} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20">
            Change
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-ink">This month's allocation</p>
          <p className="text-sm text-slate-500">
            {filled} of up to {tier.max} booked
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: tier.max }).map((_, i) => (
            <div key={i} className={`h-2.5 flex-1 rounded-full ${i < filled ? "bg-gold" : "bg-slate-200"}`} />
          ))}
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600"><Check size={15} className="text-emerald-500" /> {counts.confirmed} confirmed</span>
          <span className="flex items-center gap-1.5 text-slate-600"><Clock size={15} className="text-gold" /> {counts.pending} need your OK</span>
        </div>
      </div>

      {/* Booking cards */}
      <div className="mb-6 flex items-center gap-2">
        <Users size={18} className="text-ink" />
        <h2 className="font-display text-lg font-bold text-ink">Creators for you</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg font-bold text-ink">{b.handle}</p>
                <p className="text-sm text-slate-500">{b.niche} · {b.followers} followers</p>
              </div>
              <StatusPill status={b.status} />
            </div>
            {b.status === "proposed" && (
              <p className="mt-3 rounded-lg bg-gold/20 px-3 py-2 text-xs text-ink">
                We've lined this creator up. Confirm with your team, then schedule product or a visit directly with them.
              </p>
            )}
            {b.status === "confirmed" && (
              <p className="mt-3 text-xs text-slate-500">
                Confirmed on our end — reach out to schedule {brief.fulfillment === "ship" ? "shipping" : "their visit"}.
              </p>
            )}
          </div>
        ))}
        {filled < tier.max && (
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
            <div>
              <Plus size={20} className="mx-auto mb-1" />
              We're sourcing {tier.max - filled} more {tier.max - filled === 1 ? "creator" : "creators"} for you
            </div>
          </div>
        )}
      </div>

      {/* Brief summary + edit */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Your brief</h2>
          <button onClick={onEditBrief} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-slate-50">
            <Pencil size={14} /> Edit
          </button>
        </div>
        <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          <Row k="Industry" v={brief.industry} />
          <Row k="Market" v={brief.city || "—"} />
          <Row k="Goal" v={brief.campaignGoal || "—"} />
          <Row k="Audience" v={brief.audience || "—"} />
          <Row k="Vibe" v={brief.vibe || "—"} />
          <Row k="Fulfillment" v={FULFILLMENT.find((x) => x.id === brief.fulfillment)?.label} />
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Change your brief anytime — new creators are matched to your latest details automatically.
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{k}</p>
      <p className="text-ink">{v}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Join as a Creator
// ─────────────────────────────────────────────────────────────
function CreatorSignup() {
  const [f, setF] = useState({
    name: "", email: "", handle: "", platform: PLATFORMS[0],
    followers: "", niche: CREATOR_NICHES[0], city: "", rate: "", about: "",
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name && f.email && f.handle && f.followers;

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await sendToEmail(
        {
          name: f.name, email: f.email, handle: f.handle, platform: f.platform,
          followers: f.followers, niche: f.niche, city: f.city, rate: f.rate,
          about: f.about, form: "Creator Signup",
        },
        `New creator application — ${f.handle}`
      );
      setSent(true);
    } catch (e) {
      setErr("Something went wrong. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold">
          <Check size={26} className="text-ink" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">You're in the pool</h1>
        <p className="mt-3 text-slate-600">
          Thanks {f.name.split(" ")[0]} — we've got your profile. When a brand's
          brief matches your niche and audience, we'll reach out with the collab
          details. No spam, only real bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="max-w-xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-gold">
          <Megaphone size={13} /> For creators
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink">
          Get collabs, no cold pitching.
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Join our roster and we'll bring the brands to you. Tell us who you are
          and what you cover — we match you to campaigns that actually fit.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *"><input className={inputCls} value={f.name} onChange={set("name")} placeholder="Alex Rivera" /></Field>
          <Field label="Email *"><input className={inputCls} value={f.email} onChange={set("email")} placeholder="alex@email.com" /></Field>
          <Field label="Primary handle *"><input className={inputCls} value={f.handle} onChange={set("handle")} placeholder="@alexcreates" /></Field>
          <Field label="Main platform">
            <select className={inputCls} value={f.platform} onChange={set("platform")}>
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Follower count *"><input className={inputCls} value={f.followers} onChange={set("followers")} placeholder="45,000" /></Field>
          <Field label="Niche">
            <select className={inputCls} value={f.niche} onChange={set("niche")}>
              {CREATOR_NICHES.map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="City / market"><input className={inputCls} value={f.city} onChange={set("city")} placeholder="Miami, FL" /></Field>
          <Field label="Typical rate per post"><input className={inputCls} value={f.rate} onChange={set("rate")} placeholder="$300 (or product only)" /></Field>
        </div>
        <Field label="Tell us about your content">
          <textarea className={`${inputCls} min-h-[100px] resize-y`} value={f.about} onChange={set("about")} placeholder="Style, audience, best-performing content, brands you've worked with…" />
        </Field>
        <button
          disabled={!valid || busy}
          onClick={submit}
          className="w-full rounded-xl bg-ink py-3.5 font-semibold text-white transition enabled:hover:bg-[#1f2740] disabled:opacity-40"
        >
          {busy ? "Sending…" : "Join the roster"}
        </button>
        {err && <p className="text-center text-xs text-red-600">{err}</p>}
        {!valid && <p className="text-center text-xs text-slate-400">Name, email, handle, and follower count are required.</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Contact Us
// ─────────────────────────────────────────────────────────────
function Contact() {
  const [f, setF] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name && f.email && f.message;

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await sendToEmail(
        { name: f.name, email: f.email, topic: f.topic, message: f.message, form: "Contact" },
        `New contact message — ${f.topic}`
      );
      setSent(true);
    } catch (e) {
      setErr("Something went wrong. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink">
            Talk to us.
          </h1>
          <p className="mt-3 text-slate-600">
            Questions about a plan, a booking, or something custom? Send a note
            and a real person gets back to you.
          </p>
          <div className="mt-8 space-y-4">
            <a href="mailto:jake@bammediagroup.us" className="flex items-center gap-3 text-ink hover:opacity-70">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-gold"><Mail size={17} /></span>
              jake@bammediagroup.us
            </a>
            <a href="tel:+10000000000" className="flex items-center gap-3 text-ink hover:opacity-70">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-gold"><Phone size={17} /></span>
              Add your number
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink hover:opacity-70">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-gold"><Instagram size={17} /></span>
              @yourhandle
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {sent ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold">
                <Check size={26} className="text-ink" />
              </div>
              <p className="font-display text-xl font-bold text-ink">Message sent</p>
              <p className="mt-2 text-sm text-slate-600">We'll reply to {f.email} shortly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name *"><input className={inputCls} value={f.name} onChange={set("name")} placeholder="Your name" /></Field>
                <Field label="Email *"><input className={inputCls} value={f.email} onChange={set("email")} placeholder="you@email.com" /></Field>
              </div>
              <Field label="Topic">
                <select className={inputCls} value={f.topic} onChange={set("topic")}>
                  {["General question", "Billing", "About a booking", "Partnership", "Something else"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Message *">
                <textarea className={`${inputCls} min-h-[120px] resize-y`} value={f.message} onChange={set("message")} placeholder="How can we help?" />
              </Field>
              <button
                disabled={!valid || busy}
                onClick={submit}
                className="w-full rounded-xl bg-ink py-3.5 font-semibold text-white transition enabled:hover:bg-[#1f2740] disabled:opacity-40"
              >
                {busy ? "Sending…" : "Send message"}
              </button>
              {err && <p className="text-xs text-red-600">{err}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reusable: Agency panel (used on the Agency page and under pricing)
// ─────────────────────────────────────────────────────────────
function AgencyPanel() {
  return (
    <div className="overflow-hidden rounded-3xl bg-ink p-10 text-white sm:p-14">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
        <Sparkles size={13} /> Full-service
      </div>
      <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
        Need more than bookings? Meet BAM Media.
      </h2>
      <p className="mt-4 max-w-xl text-lg text-slate-300">
        The self-serve plans handle steady creator bookings. When you're ready
        for full campaign strategy, a dedicated team, analytics, and larger
        budgets, our agency takes it from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          "Dedicated account team",
          "Strategy & analytics",
          "Multi-market campaigns",
        ].map((x) => (
          <div key={x} className="rounded-xl bg-white/10 p-4 text-sm font-medium text-white">
            <Check size={16} className="mb-2 text-gold" />
            {x}
          </div>
        ))}
      </div>

      <a
        href={AGENCY_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-ink transition hover:brightness-105"
      >
        Visit bammedia.us <ArrowUpRight size={18} />
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Agency (bammedia.us)
// ─────────────────────────────────────────────────────────────
function Agency() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <AgencyPanel />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
export default function App() {
  // step drives the brand-side flow: tiers | onboard | dashboard
  // page drives top-level nav: home | creators | contact | agency
  const [page, setPage] = useState("home");
  const [step, setStep] = useState("tiers");
  const [tier, setTier] = useState(null);
  const [brief, setBrief] = useState(null);
  const [bookings] = useState(SEED);
  const [menuOpen, setMenuOpen] = useState(false);

  const pickTier = (t) => { setTier(t); setStep("onboard"); };
  const submitBrief = (f) => { setBrief(f); setStep("dashboard"); };

  const go = (p) => { setPage(p); setMenuOpen(false); };
  const goHome = () => { setPage("home"); setStep(brief ? "dashboard" : "tiers"); setMenuOpen(false); };

  const NAV = [
    { id: "home", label: "For brands" },
    { id: "creators", label: "Join as a creator" },
    { id: "agency", label: "Full-service agency" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button onClick={goHome} className="font-display text-lg font-bold tracking-tight">
            creator<span className="text-gold">desk</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => (n.id === "home" ? goHome() : go(n.id))}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  page === n.id ? "text-ink" : "text-slate-500 hover:text-ink"
                }`}
              >
                {n.label}
              </button>
            ))}
            <button onClick={goHome} className="ml-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f2740]">
              Get started
            </button>
          </nav>

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-slate-200 px-6 py-3 md:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => (n.id === "home" ? goHome() : go(n.id))}
                className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-white"
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {page === "home" && (
        <>
          {step === "tiers" && <TierSelect onPick={pickTier} />}
          {step === "onboard" && (
            <Onboarding
              tier={tier}
              initial={brief}
              onBack={() => setStep(brief ? "dashboard" : "tiers")}
              onSubmit={submitBrief}
            />
          )}
          {step === "dashboard" && (
            <Dashboard
              tier={tier}
              brief={brief}
              bookings={bookings}
              onEditBrief={() => setStep("onboard")}
              onChangeTier={() => setStep("tiers")}
            />
          )}
        </>
      )}
      {page === "creators" && <CreatorSignup />}
      {page === "contact" && <Contact />}
      {page === "agency" && <Agency />}

      <footer className="mt-8 border-t border-slate-200">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500">
          <span className="font-display font-bold text-ink">
            creator<span className="text-gold">desk</span>
          </span>
          <div className="flex flex-wrap gap-5">
            <button onClick={goHome} className="hover:text-ink">For brands</button>
            <button onClick={() => go("creators")} className="hover:text-ink">Join as a creator</button>
            <button onClick={() => go("contact")} className="hover:text-ink">Contact</button>
            <a href={AGENCY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
              bammedia.us <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
