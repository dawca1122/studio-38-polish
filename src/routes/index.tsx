import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Phone, MapPin, Clock, Star, ArrowUpRight, Menu, X, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";

import stoneDark from "@/assets/stone-dark.jpg";
import paperLight from "@/assets/paper-light.jpg";
import oNasInterior from "@/assets/o-nas-interior.jpg";
import gal1 from "@/assets/gal-1.jpg";
import gal2 from "@/assets/gal-2.jpg";
import gal3 from "@/assets/gal-3.jpg";
import gal4 from "@/assets/gal-4.jpg";
import gal5 from "@/assets/gal-5.jpg";
import gal6 from "@/assets/gal-6.jpg";
import heroPhoto from "@/assets/studio38-hero.jpg.asset.json";
import serviceStone01 from "@/assets/service-stone-01.jpg";
import serviceStone02 from "@/assets/service-stone-02.jpg";
import serviceStone03 from "@/assets/service-stone-03.jpg";
import serviceStone04 from "@/assets/service-stone-04.jpg";
import serviceStone05 from "@/assets/service-stone-05.jpg";
import serviceStone06 from "@/assets/service-stone-06.jpg";

export const Route = createFileRoute("/")({
  component: Studio38,
  head: () => ({
    meta: [
      { title: "Fryzjer Opole — Studio 38 | Fryzjerstwo premium" },
      { name: "description", content: "Studio 38 w Opolu — fryzjerstwo premium, ul. Kośnego 38. Strzyżenie, koloryzacja, stylizacja. Ocena 4,9 · 115 opinii Google. Rezerwacja: +48 733 888 128." },
      { property: "og:title", content: "Studio 38 — Fryzjer Opole" },
      { property: "og:description", content: "Fryzjerstwo premium w sercu Opola. 4,9 ★ · 115 opinii Google." },
      { property: "og:image", content: stoneDark },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

/* ------------------------ Data ------------------------ */
const PHONE_DISPLAY = "+48 733 888 128";
const PHONE_HREF = "tel:+48733888128";
const ADDRESS = "Augustyna Kośnego 38/2, 45-056 Opole";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Studio+38+Augustyna+Ko%C5%9Bnego+38+Opole";
const MAPS_EMBED = "https://www.google.com/maps?q=Augustyna+Ko%C5%9Bnego+38,+45-056+Opole&z=16&output=embed";

const HOURS: [string, string][] = [
  ["Poniedziałek", "Zamknięte"],
  ["Wtorek", "08:00 – 19:00"],
  ["Środa", "08:00 – 16:00"],
  ["Czwartek", "11:00 – 19:00"],
  ["Piątek", "08:00 – 16:00"],
  ["Sobota", "07:00 – 14:00"],
  ["Niedziela", "Zamknięte"],
];

const SERVICES = [
  { n: "01", t: "Strzyżenie damskie", d: "Autorskie cięcia szyte pod kobietę — od klasyki po kierunkowe formy.", p: "od 120 zł" },
  { n: "02", t: "Strzyżenie męskie", d: "Precyzyjne strzyżenie, konturowanie, wykończenie brzytwą.", p: "od 90 zł" },
  { n: "03", t: "Koloryzacja", d: "Balayage, sombré, refleksy, głębokie odbudowujące koloryzacje.", p: "od 280 zł" },
  { n: "04", t: "Stylizacja i upięcia", d: "Wieczorowe upięcia i eventowe stylizacje pod okazję.", p: "od 180 zł" },
  { n: "05", t: "Pielęgnacja i regeneracja", d: "Rytuały odbudowy — Olaplex, botox, keratyna.", p: "od 160 zł" },
];

const SERVICE_STONES = [
  serviceStone01,
  serviceStone02,
  serviceStone03,
  serviceStone04,
  serviceStone05,
  serviceStone06,
];

// Placeholder reviews — replace with real Google reviews when available
const REVIEWS = [
  { name: "K. M.", tag: "Efekt", text: "Wyszłam po koloryzacji z włosami, o jakich zawsze marzyłam — subtelne, głębokie, idealnie dopasowane. Studio, do którego wraca się bez wahania.", placeholder: true },
  { name: "P. W.", tag: "Atmosfera", text: "Miejsce ma klasę — od wnętrza po każdy detal. Czuć, że ktoś tu naprawdę dba o rzemiosło. Kawa, cisza, spokój i profesjonalizm.", placeholder: true },
  { name: "A. Z.", tag: "Obsługa", text: "Konsultacja bez pośpiechu, propozycja szyta na miarę mojego typu włosów. Efekt lepszy niż się spodziewałam. Polecam każdemu w Opolu.", placeholder: true },
];

const GALLERY = [
  { src: gal1, alt: "Damska koloryzacja balayage — ciepłe karmelowe refleksy na ciemnych włosach", w: 1200, h: 1500, tag: "Balayage" },
  { src: gal5, alt: "Wnętrze salonu — czarny fotel barberski ze złotymi detalami przy ceglanej ścianie", w: 1200, h: 1200, tag: "Wnętrze" },
  { src: gal3, alt: "Elegancki wieczorowy kok z pasmami — stylizacja okazjonalna", w: 1200, h: 1500, tag: "Upięcie" },
  { src: gal2, alt: "Męska fryzura z precyzyjnym skin fade — ujęcie z tyłu", w: 1200, h: 1200, tag: "Fade" },
  { src: gal4, alt: "Platynowy blond — jedwabiste, gładkie włosy w naturalnym połysku", w: 1200, h: 1500, tag: "Blond" },
  { src: gal6, alt: "Głęboka miedziana koloryzacja — długie fale z wielowymiarowym odcieniem", w: 1200, h: 1500, tag: "Miedź" },
];

/* ------------------------ Hooks ------------------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.delay || i * 60);
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------ Components ------------------------ */

function Stars({ value = 4.9, size = 14 }: { value?: number; size?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`Ocena ${value.toString().replace(".", ",")} na 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < full) return <Star key={i} size={size} className="text-[#D4AF37]" fill="#D4AF37" strokeWidth={0} />;
        if (i === full && partial > 0) {
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-[#3a3a3a]" fill="#3a3a3a" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${partial * 100}%` }}>
                <Star size={size} className="text-[#D4AF37]" fill="#D4AF37" strokeWidth={0} />
              </span>
            </span>
          );
        }
        return <Star key={i} size={size} className="text-[#3a3a3a]" fill="#3a3a3a" strokeWidth={0} />;
      })}
    </span>
  );
}

function Nav({ onOpen }: { onOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["O nas", "#o-nas"],
    ["Usługi", "#uslugi"],
    ["Galeria", "#galeria"],
    ["Opinie", "#opinie"],
    ["Kontakt", "#kontakt"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-[#0B0B0B]/70 border-b border-[#D4AF37]/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <a href="#top" className="display text-lg tracking-[0.25em] text-bone md:text-xl">
          STUDIO<span className="text-[#D4AF37]">38</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[11px] uppercase tracking-[0.3em] text-bone/80 transition-colors hover:text-[#D4AF37]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a href={PHONE_HREF} className="hidden md:inline-flex btn-gold !py-3 !px-5 !text-[10px]">
          <Phone size={13} /> Zadzwoń
        </a>
        <button
          onClick={onOpen}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center text-bone"
          aria-label="Otwórz menu"
        >
          <Menu size={22} />
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="gold-hairline opacity-30" />
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    ["O nas", "#o-nas"],
    ["Usługi", "#uslugi"],
    ["Galeria", "#galeria"],
    ["Opinie", "#opinie"],
    ["Kontakt", "#kontakt"],
  ];
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 md:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(11,11,11,0.98)" }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <span className="display text-lg tracking-[0.25em] text-bone">
          STUDIO<span className="text-[#D4AF37]">38</span>
        </span>
        <button onClick={onClose} className="h-11 w-11 inline-flex items-center justify-center text-bone" aria-label="Zamknij menu">
          <X size={24} />
        </button>
      </div>
      <div className="gold-hairline mx-5 opacity-40" />
      <nav className="mt-10 flex flex-col items-center gap-8 px-6">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            className="display text-3xl tracking-[0.15em] text-bone transition-colors hover:text-[#D4AF37]"
          >
            {label}
          </a>
        ))}
        <a href={PHONE_HREF} onClick={onClose} className="btn-gold mt-6">
          <Phone size={14} /> Zadzwoń i umów wizytę
        </a>
        <p className="mt-2 text-xs tracking-[0.3em] uppercase text-bone/60">{PHONE_DISPLAY}</p>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden noise">
      {/* Real salon interior — warm cinematic grade with slow Ken Burns */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroPhoto.url}
          alt="Wnętrze Studio 38 — ceglane ściany i ciepłe światło"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
          style={{
            filter: "saturate(1.18) contrast(1.08) brightness(1.02)",
          }}
        />
      </div>
      {/* Directional gradient — dark where text sits, transparent over the warm right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,11,11,0.92) 0%, rgba(11,11,11,0.78) 22%, rgba(11,11,11,0.45) 45%, rgba(11,11,11,0.10) 65%, rgba(11,11,11,0) 85%)",
        }}
      />
      {/* Bottom fade for scroll cue legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(11,11,11,0) 0%, rgba(11,11,11,0.7) 100%)" }}
      />
      {/* Warm ceiling bloom */}
      <div
        className="absolute inset-x-0 top-0 h-64 pointer-events-none mix-blend-screen opacity-60"
        style={{
          background:
            "radial-gradient(60% 100% at 70% 0%, rgba(255,190,110,0.28) 0%, rgba(255,170,90,0.10) 40%, transparent 70%)",
        }}
      />
      {/* Subtle edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(11,11,11,0.55) 100%)",
        }}
      />
      {/* Halftone decorative accent */}
      <div className="halftone absolute -right-10 top-24 hidden h-40 w-40 md:block" aria-hidden />
      <div className="halftone absolute bottom-16 left-4 h-24 w-24 md:h-32 md:w-32" aria-hidden />


      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-32 md:px-10 md:pt-40">
        {/* Rating badge */}
        <div className="reveal flex items-center gap-3 pb-8">
          <Stars value={4.9} />
          <span className="text-[11px] tracking-[0.3em] uppercase text-bone/85">
            4,9 · 115 opinii Google
          </span>
        </div>

        {/* Eyebrow */}
        <div className="reveal flex items-center gap-4 pb-6" data-delay="120">
          <span className="block h-px w-14 bg-[#D4AF37]" />
          <span className="eyebrow">Fryzjer · Opole · Kośnego 38</span>
        </div>

        {/* Headline */}
        <h1
          className="reveal display text-bone leading-[0.95]"
          data-delay="240"
          style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)", letterSpacing: "0.02em" }}
        >
          STUDIO<span className="text-[#D4AF37]"> / </span>38
        </h1>

        {/* Sub */}
        <p
          className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-bone/90 md:text-2xl"
          data-delay="360"
        >
          Fryzjerstwo premium w sercu Opola. Autorskie strzyżenia, głębokie koloryzacje i rytuały pielęgnacyjne — w kameralnym, editorialowym studiu.
        </p>

        <div className="gold-hairline reveal mt-10 w-32" data-delay="480" />

        <div className="reveal mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center" data-delay="560">
          <a href={PHONE_HREF} className="btn-gold">
            <Phone size={14} /> Zadzwoń i umów wizytę
          </a>
          <a href={PHONE_HREF} className="text-sm tracking-[0.24em] uppercase text-bone/90 hover:text-[#D4AF37] transition-colors">
            {PHONE_DISPLAY}
          </a>
        </div>

        {/* Scroll cue */}
        <a
          href="#o-nas"
          className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-bone/60 hover:text-[#D4AF37]"
          aria-label="Przewiń w dół"
        >
          Przewiń
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}

function ONas() {
  return (
    <section id="o-nas" className="relative overflow-hidden">
      <img src={paperLight} alt="" aria-hidden width={1600} height={1200} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(245,245,245,0.94), rgba(245,245,245,0.98))" }} />
      <div className="halftone absolute right-8 top-8 h-32 w-32 opacity-40" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 py-24 md:grid-cols-12 md:gap-20 md:px-10 md:py-32">
        <div className="md:col-span-5 reveal reveal-left">
          <div className="relative aspect-[4/5] overflow-hidden border border-[#2C2C2C]/20" style={{ boxShadow: "0 40px 60px -30px rgba(0,0,0,0.35)" }}>
            <img src={oNasInterior} alt="Wnętrze Studio 38 — ceglana ściana, czarny fotel, okrągłe lustro" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 border border-[#D4AF37]/40 m-2" aria-hidden />
          </div>
        </div>

        <div className="md:col-span-7 reveal reveal-right" data-delay="150">
          <div className="flex items-center gap-4">
            <span className="block h-px w-10 bg-[#D4AF37]" />
            <span className="eyebrow" style={{ color: "#2C2C2C" }}>O studiu</span>
          </div>
          <h2 className="display mt-6 text-[#0B0B0B]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.05 }}>
            Miejsce, w którym fryzjerstwo jest rzemiosłem
          </h2>
          <div className="gold-hairline-solid mt-8 w-24" />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#2C2C2C]">
            Studio 38 to kameralna pracownia fryzjerska w sercu Opola. Pracujemy bez pośpiechu — konsultacja, precyzja, dbałość o kondycję włosa. Każda wizyta jest zaprojektowana pod jedną osobę i jeden efekt.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#2C2C2C]/85">
            Wybieramy zabiegi, które służą włosom długofalowo, i produkty, którym sami ufamy. Rezerwacja odbywa się telefonicznie — dzięki temu każdy termin jest przemyślany, a klientka wie, że jej czas należy tylko do niej.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="display text-3xl text-[#0B0B0B]">4,9</div>
              <div className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[#2C2C2C]/70">Ocena Google</div>
            </div>
            <div>
              <div className="display text-3xl text-[#0B0B0B]">115</div>
              <div className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[#2C2C2C]/70">Opinii</div>
            </div>
            <div>
              <div className="display text-3xl text-[#0B0B0B]">38</div>
              <div className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[#2C2C2C]/70">Kośnego</div>
            </div>
          </div>
        </div>
      </div>
      <div className="gold-hairline-solid mx-auto max-w-7xl opacity-30" />
    </section>
  );
}

function Uslugi() {
  return (
    <section id="uslugi" className="relative overflow-hidden bg-ink py-24 md:py-32 noise">
      <div className="halftone absolute left-6 top-24 h-28 w-28" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex items-end justify-between gap-8 pb-16 md:pb-20">
          <div className="reveal reveal-left">
            <div className="flex items-center gap-4">
              <span className="block h-px w-10 bg-[#D4AF37]" />
              <span className="eyebrow">Usługi</span>
            </div>
            <h2 className="display mt-6 text-bone" style={{ fontSize: "clamp(2rem, 4.8vw, 3.75rem)", lineHeight: 1.05 }}>
              Autorska <br />pracownia
            </h2>
          </div>
          <p className="reveal reveal-right hidden max-w-sm text-sm leading-relaxed text-bone/70 md:block" data-delay="120">
            Cennik od — finalna wycena po konsultacji, dopasowana do długości i struktury włosa.
          </p>
        </div>

        <div className="grid gap-px bg-[#D4AF37]/15 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <article
              key={s.n}
              className="service-card group reveal relative flex gap-6 p-8 md:gap-10 md:p-12"
              data-delay={i * 90}
              style={{ "--service-stone": `url(${SERVICE_STONES[i]})` } as CSSProperties}
            >
              <div className="relative z-10 display text-[#D4AF37]/60 text-xl md:text-2xl leading-none pt-1 shrink-0">{s.n}</div>
              <div className="relative z-10 min-w-0 flex-1">
                <h3 className="display text-bone text-xl md:text-2xl">{s.t}</h3>
                <div className="mt-3 h-px w-10 bg-[#D4AF37]/70 transition-all duration-500 group-hover:w-24" />
                <p className="mt-4 text-sm leading-relaxed text-bone/70 md:text-base">{s.d}</p>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-bone/50">Cena</span>
                  <span className="display text-[#D4AF37] text-lg">{s.p}</span>
                </div>
              </div>
            </article>
          ))}
          <article
            className="service-card service-card--cta reveal relative flex flex-col items-start justify-center gap-6 overflow-hidden p-8 md:p-12"
            data-delay={SERVICES.length * 90}
            style={{ "--service-stone": `url(${SERVICE_STONES[5]})` } as CSSProperties}
          >
            <span aria-hidden className="service-halftone" />
            <span className="relative z-10 eyebrow">Nie wiesz co wybrać?</span>
            <p className="relative z-10 display text-bone text-xl leading-tight md:text-2xl">Zadzwoń — dobierzemy zabieg pod Twoje włosy.</p>
            <a href={PHONE_HREF} className="btn-gold relative z-10 mt-2">
              <Phone size={14} /> Rezerwacja telefoniczna
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Galeria({ onOpen, onOpenAll }: { onOpen: (i: number) => void; onOpenAll: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const rect = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { setTranslate(0); return; }
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth + 40);
      setTranslate(progress * maxX);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Scroll length: ~80vh per image beyond the first, so 6 imgs → ~500vh section.
  const sectionHeight = reduced ? "auto" : `${100 + (GALLERY.length - 1) * 70}vh`;

  return (
    <section
      id="galeria"
      ref={wrapRef}
      className="relative noise"
      style={{ background: "#111111", height: sectionHeight }}
    >
      <div className={`${reduced ? "" : "sticky top-0"} h-screen overflow-hidden flex flex-col justify-center`}>
        <div className="mx-auto max-w-7xl w-full px-5 md:px-10">
          <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <div className="reveal reveal-left">
              <div className="flex items-center gap-4">
                <span className="block h-px w-10 bg-[#D4AF37]" />
                <span className="eyebrow">Galeria</span>
              </div>
              <h2 className="display mt-5 text-bone" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.05 }}>
                Nasze realizacje
              </h2>
              <p className="mt-3 max-w-md text-[#F5F5F5]/60 text-sm">
                Przewiń, aby zobaczyć portfolio. Kliknij zdjęcie, aby powiększyć.
              </p>
            </div>
            <button
              onClick={onOpenAll}
              className="btn-ghost self-start md:self-auto"
              aria-label="Zobacz całą galerię"
            >
              Zobacz całą galerię <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className={reduced ? "overflow-x-auto" : "overflow-hidden"}>
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 px-5 md:px-10 will-change-transform"
            style={{
              transform: reduced ? "none" : `translate3d(${-translate}px, 0, 0)`,
              transition: reduced ? undefined : "transform 120ms linear",
            }}
          >
            {GALLERY.map((g, i) => (
              <button
                key={i}
                onClick={() => onOpen(i)}
                className="group relative shrink-0 overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 transition-colors"
                style={{ width: "min(78vw, 440px)", aspectRatio: "4 / 5" }}
                aria-label={`Otwórz zdjęcie: ${g.alt}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  width={g.w}
                  height={g.h}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-[#D4AF37]/70" aria-hidden />
                <span className="pointer-events-none absolute right-3 bottom-3 h-6 w-6 border-r border-b border-[#D4AF37]/70" aria-hidden />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                  <span className="eyebrow text-[#D4AF37]" style={{ letterSpacing: "0.24em" }}>{g.tag}</span>
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    Powiększ <ArrowUpRight size={14} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FullGallery({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: (i: number) => void }) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", on);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] bg-[#0B0B0B] overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-10 py-4 bg-[#0B0B0B]/95 backdrop-blur border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-4">
          <span className="block h-px w-10 bg-[#D4AF37]" />
          <span className="eyebrow">Galeria — pełna</span>
        </div>
        <button
          onClick={onClose}
          className="h-11 w-11 inline-flex items-center justify-center text-bone hover:text-[#D4AF37]"
          aria-label="Zamknij galerię"
        >
          <X size={24} />
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-10 md:py-16">
        <h2 className="display text-bone mb-8" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", lineHeight: 1.05 }}>
          Nasze realizacje
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {GALLERY.map((g, i) => (
            <button
              key={i}
              onClick={() => onOpen(i)}
              className="group relative overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-colors"
              style={{ aspectRatio: "4 / 5" }}
              aria-label={`Otwórz zdjęcie: ${g.alt}`}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <span className="absolute left-4 bottom-4 eyebrow text-[#D4AF37]" style={{ letterSpacing: "0.24em" }}>{g.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Lightbox({ index, onClose, onNav }: { index: number | null; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    if (index === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", on);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);
  if (index === null) return null;
  const g = GALLERY[index];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0B0B]/97 p-5 md:p-10" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 h-11 w-11 inline-flex items-center justify-center text-bone hover:text-[#D4AF37]" aria-label="Zamknij">
        <X size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 inline-flex items-center justify-center text-bone hover:text-[#D4AF37]"
        aria-label="Poprzednie"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 inline-flex items-center justify-center text-bone hover:text-[#D4AF37]"
        aria-label="Następne"
      >
        <ArrowRight size={24} />
      </button>
      <img
        src={g.src}
        alt={g.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full object-contain border border-[#D4AF37]/40"
      />
    </div>
  );
}

function Opinie() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!embla) return;
    const on = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", on);
    on();
  }, [embla]);
  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <section id="opinie" className="relative overflow-hidden py-24 md:py-32 noise" style={{ background: "#0B0B0B" }}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-8 pb-14 md:flex-row md:items-end md:justify-between md:pb-20">
          <div className="reveal reveal-left">
            <div className="flex items-center gap-4">
              <span className="block h-px w-10 bg-[#D4AF37]" />
              <span className="eyebrow">Opinie</span>
            </div>
            <h2 className="display mt-6 text-bone" style={{ fontSize: "clamp(2rem, 4.8vw, 3.75rem)", lineHeight: 1.05 }}>
              4,9 <span className="text-[#D4AF37]">/</span> 5
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars value={4.9} size={16} />
              <span className="text-xs tracking-[0.3em] uppercase text-bone/70">115 opinii Google</span>
            </div>
          </div>
          <div className="reveal reveal-right flex gap-3" data-delay="150">
            <button onClick={() => embla?.scrollPrev()} className="h-12 w-12 inline-flex items-center justify-center border border-[#D4AF37]/40 text-bone hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors" aria-label="Poprzednia opinia">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => embla?.scrollNext()} className="h-12 w-12 inline-flex items-center justify-center border border-[#D4AF37]/40 text-bone hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors" aria-label="Następna opinia">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden reveal" ref={emblaRef}>
          <div className="flex">
            {REVIEWS.map((r, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full pr-4 md:basis-1/2 md:pr-6">
                <article className="relative flex h-full flex-col justify-between gap-8 border border-[#D4AF37]/20 bg-[#2C2C2C] p-8 md:p-12">
                  <div>
                    <div className="flex items-center justify-between">
                      <Stars value={5} size={14} />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/80">{r.tag}</span>
                    </div>
                    <p className="mt-8 text-lg leading-relaxed text-bone/90 md:text-xl">“{r.text}”</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="display text-sm tracking-[0.25em] text-bone">{r.name}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-bone/50">Klient Google</div>
                    </div>
                    <span className="halftone h-10 w-10" aria-hidden />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-px transition-all duration-500 ${selected === i ? "w-12 bg-[#D4AF37]" : "w-6 bg-bone/25"}`}
                aria-label={`Opinia ${i + 1}`}
              />
            ))}
          </div>
          <a
            href="https://www.google.com/search?q=Studio+38+Opole+Ko%C5%9Bnego+opinie"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Zobacz wszystkie opinie w Google <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Kontakt() {
  return (
    <section id="kontakt" className="relative overflow-hidden py-24 md:py-32 noise bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="pb-16 md:pb-20 reveal">
          <div className="flex items-center gap-4">
            <span className="block h-px w-10 bg-[#D4AF37]" />
            <span className="eyebrow">Godziny · Kontakt</span>
          </div>
          <h2 className="display mt-6 text-bone" style={{ fontSize: "clamp(2rem, 4.8vw, 3.75rem)", lineHeight: 1.05 }}>
            Umów wizytę
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Details card */}
          <div className="reveal reveal-left relative flex flex-col justify-between border border-[#D4AF37]/25 bg-[#141414] p-8 md:p-12">
            <div>
              <span className="eyebrow">Rezerwacja telefoniczna</span>
              <a
                href={PHONE_HREF}
                className="display mt-4 block text-bone transition-colors hover:text-[#D4AF37]"
                style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", letterSpacing: "0.05em" }}
              >
                {PHONE_DISPLAY}
              </a>
              <div className="gold-hairline my-8 w-24" />

              <div className="flex items-start gap-4">
                <MapPin size={18} className="mt-1 text-[#D4AF37]" />
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-bone/60">Adres</div>
                  <div className="mt-1 text-bone">{ADDRESS}</div>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3">
                    Otwórz w Google Maps <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-4">
                <Clock size={18} className="mt-1 text-[#D4AF37]" />
                <div className="flex-1">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-bone/60">Godziny otwarcia</div>
                  <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-2 text-sm">
                    {HOURS.map(([d, h]) => (
                      <div key={d} className="col-span-2 grid grid-cols-[1fr_auto] items-baseline gap-4">
                        <dt className="text-bone/80">{d}</dt>
                        <dd className={`display text-xs tracking-widest ${h === "Zamknięte" ? "text-bone/40" : "text-bone"}`}>
                          {h}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <a href={PHONE_HREF} className="btn-gold mt-10 self-start">
              <Phone size={14} /> Zadzwoń i umów wizytę
            </a>
          </div>

          {/* Map */}
          <div className="reveal reveal-right relative overflow-hidden border border-[#D4AF37]/25 min-h-[420px] md:min-h-full" data-delay="150">
            <iframe
              title="Mapa — Studio 38 Opole"
              src={MAPS_EMBED}
              loading="lazy"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) contrast(0.85) saturate(0.6) brightness(0.9)" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 border border-[#D4AF37]/20 m-2" aria-hidden />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 border border-[#D4AF37]/50 bg-[#0B0B0B]/90 backdrop-blur px-5 py-3 text-xs tracking-[0.25em] uppercase text-bone hover:text-[#D4AF37] transition-colors"
            >
              Otwórz w Google Maps <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-ink border-t border-[#D4AF37]/30">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="display text-3xl tracking-[0.2em] text-bone md:text-4xl">
              STUDIO<span className="text-[#D4AF37]"> / </span>38
            </div>
            <p className="mt-4 max-w-sm text-sm text-bone/60 leading-relaxed">
              Fryzjerstwo premium w Opolu. Autorskie strzyżenia i głębokie koloryzacje w kameralnej pracowni.
            </p>
          </div>
          <div>
            <div className="eyebrow">Kontakt</div>
            <a href={PHONE_HREF} className="mt-4 block text-bone hover:text-[#D4AF37] transition-colors">{PHONE_DISPLAY}</a>
            <p className="mt-2 text-sm text-bone/70">{ADDRESS}</p>
          </div>
          <div>
            <div className="eyebrow">Godziny</div>
            <ul className="mt-4 space-y-1.5 text-[13px] text-bone/75">
              {HOURS.map(([d, h]) => (
                <li key={d} className="flex justify-between gap-3">
                  <span>{d.slice(0, 3)}</span>
                  <span className={h === "Zamknięte" ? "text-bone/40" : "text-bone/90"}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="gold-hairline mt-14 opacity-30" />
        <div className="mt-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] tracking-[0.3em] uppercase text-bone/50">© {new Date().getFullYear()} Studio 38 · Opole</p>
          <p className="text-[11px] tracking-[0.3em] uppercase text-bone/50">Design · GUSCHALL</p>
        </div>
      </div>
    </footer>
  );
}

function StickyCallBar() {
  return (
    <a
      href={PHONE_HREF}
      className="md:hidden fixed inset-x-4 bottom-4 z-30 flex items-center justify-center gap-3 border border-[#D4AF37] bg-[#0B0B0B]/95 backdrop-blur-xl px-6 py-4 text-[11px] tracking-[0.3em] uppercase text-bone shadow-2xl"
      style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8)" }}
    >
      <Phone size={16} className="text-[#D4AF37]" />
      Zadzwoń i umów wizytę
    </a>
  );
}

/* ------------------------ Page ------------------------ */
function Studio38() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  useReveal();
  const galleryLen = GALLERY.length;

  return (
    <main className="relative min-h-screen bg-ink text-bone">
      <Nav onOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Hero />
      <ONas />
      <Uslugi />
      <Galeria onOpen={setLightbox} onOpenAll={() => setFullOpen(true)} />
      <Opinie />
      <Kontakt />
      <Footer />

      <FullGallery
        open={fullOpen}
        onClose={() => setFullOpen(false)}
        onOpen={(i) => setLightbox(i)}
      />

      <Lightbox
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNav={(d) => setLightbox((i) => (i === null ? i : (i + d + galleryLen) % galleryLen))}
      />

      <StickyCallBar />

      {/* Bottom padding on mobile so sticky bar never overlaps content */}
      <div className="h-24 md:hidden" aria-hidden />
    </main>
  );
}
