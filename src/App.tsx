import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import heroVideo from "./assets/hero.mp4";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const products = [
  {
    id: 1,
    name: "Noir Essence",
    tagline: "Depth of Midnight",
    description:
      "A bold, woody fragrance that opens with smoky black pepper and settles into deep amber resin and sacred musk. Wear it for the nights you want to be remembered.",
    price: "$120",
    notes: ["Black Pepper", "Amber", "Musk", "Sandalwood"],
    mood: "Dark · Intense · Sensual",
    sizes: ["50ml", "100ml", "200ml"],
    bg: "#0b0b0f",
    bgGrad: "radial-gradient(ellipse 80% 60% at 30% 50%, #2a1a08 0%, #0b0b0f 70%)",
    accent: "#c9a96e",
    image: "/images/noir.jpg",
  },
  {
    id: 2,
    name: "Velvet Bloom",
    tagline: "Soft Power",
    description:
      "An elegant floral heart wrapped in warm vanilla and white musk. Peony opens bright, rose deepens it, and vanilla leaves a trail that's impossible to ignore.",
    price: "$140",
    notes: ["Rose", "Peony", "Vanilla", "White Musk"],
    mood: "Romantic · Soft · Luxurious",
    sizes: ["50ml", "100ml", "200ml"],
    bg: "#100610",
    bgGrad: "radial-gradient(ellipse 80% 60% at 30% 50%, #2d0d1f 0%, #100610 70%)",
    accent: "#e8a0b4",
    image: "/images/velvet.jpg",
  },
  {
    id: 3,
    name: "Azure Mist",
    tagline: "Fresh Horizon",
    description:
      "Crisp oceanic tones cut through with bright bergamot and a dry vetiver base. Clean, modern, effortless. The kind of scent that makes you feel like you're already somewhere better.",
    price: "$160",
    notes: ["Bergamot", "Sea Salt", "Vetiver", "Cedarwood"],
    mood: "Fresh · Clean · Modern",
    sizes: ["50ml", "100ml", "200ml"],
    bg: "#040e1a",
    bgGrad: "radial-gradient(ellipse 80% 60% at 30% 50%, #0a2540 0%, #040e1a 70%)",
    accent: "#7ecfe4",
    image: "/images/azure.jpg",
  },
];

/* ─────────────────────────────────────────
   LIQUID GLASS STYLES
   Key: very low bg opacity + no heavy tint
   = pure refractive clarity
───────────────────────────────────────── */
const liquidGlass =
  "backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.1] shadow-[0_2px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.1)]";

const liquidGlassHeavy =
  "backdrop-blur-[32px] bg-white/[0.05] border border-white/[0.12] shadow-[0_8px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.12)]";

/* ─────────────────────────────────────────
   SPRING CONFIG for buttery motion
───────────────────────────────────────── */
const spring = { type: "spring", stiffness: 320, damping: 36, mass: 0.8 };
const springSnappy = { type: "spring", stiffness: 420, damping: 38 };
const easeOut = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────
   TILT CARD (product image left panel)
───────────────────────────────────────── */
function TiltImage({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), spring);
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), spring);
  const gloss = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 1]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800 }}
      className="w-full h-full relative"
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {/* fallback if no image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.55, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-28 mx-auto mb-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${accent}55, ${accent}15)`,
              border: `1px solid ${accent}40`,
              boxShadow: `0 0 40px ${accent}30`,
            }}
          />
          <p className="text-white/20 text-[10px] font-[system-ui] tracking-[0.3em]">PRODUCT IMAGE</p>
        </div>
      </div>
      {/* gloss sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-none"
        style={{
          background: useTransform(
            gloss,
            [0, 1],
            [
              "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0) 100%)",
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            ]
          ),
        }}
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.06]" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  /* modal state: null | "expand" | "done" */
  const [modal, setModal] = useState<null | "open" | "done">(null);
  const [selectedSize, setSelectedSize] = useState("");

  const current = products[index];

  const go = useCallback(
    (d: 1 | -1) => {
      const next = index + d;
      if (next < 0 || next >= products.length) return;
      setDir(d);
      setIndex(next);
    },
    [index]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const openModal = () => { setSelectedSize(""); setModal("open"); };
  const closeModal = () => setModal(null);
  const handleAdd = () => {
    if (!selectedSize) return;
    setModal("done");
    setTimeout(() => setModal(null), 1600);
  };

  /* slide variants */
  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
      filter: "blur(4px)",
    }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (d: number) => ({
      x: d > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.96,
      filter: "blur(4px)",
    }),
  };

  /* ── background color spring ── */
  const bgR = useSpring(parseInt(current.bg.slice(1, 3), 16), { stiffness: 80, damping: 22 });
  const bgG = useSpring(parseInt(current.bg.slice(3, 5), 16), { stiffness: 80, damping: 22 });
  const bgB = useSpring(parseInt(current.bg.slice(5, 7), 16), { stiffness: 80, damping: 22 });
  useEffect(() => {
    bgR.set(parseInt(current.bg.slice(1, 3), 16));
    bgG.set(parseInt(current.bg.slice(3, 5), 16));
    bgB.set(parseInt(current.bg.slice(5, 7), 16));
  }, [current]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white font-[Cormorant_Garamond,serif]"
      style={{ background: "#060406" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[min(92%,660px)]">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...spring }}
          className={`${liquidGlass} rounded-full px-7 py-3.5 flex items-center justify-between`}
        >
          <span className="tracking-[0.45em] text-[11px] font-semibold text-white/90 font-[system-ui]">
            LUXE
          </span>
          <div className="flex gap-7 text-[12px] text-white/50 font-[system-ui]">
            {["Story", "Fragrance", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-white/90 transition-colors duration-300 relative group"
              >
                {l}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>
        </motion.div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
          style={{ filter: "brightness(0.85) contrast(1.05)" }}
        />
        {/* vignette only, no tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.7, duration: 1.2 }}
            className="text-[10px] text-white/45 mb-5 font-[system-ui] uppercase"
          >
            A New Era of Scent
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.4, ease: easeOut }}
            className="text-[clamp(52px,9vw,130px)] leading-[0.92] tracking-[-0.02em] text-white font-light"
          >
            Luxury<br />
            <em className="italic">Redefined</em>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: easeOut }}
            className="mt-10"
          >
            <motion.a
              href="#fragrance"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`${liquidGlass} inline-block px-9 py-3.5 rounded-full text-[12px] text-white/75 hover:text-white transition-colors duration-300 font-[system-ui] tracking-[0.2em]`}
            >
              EXPLORE THE COLLECTION
            </motion.a>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <span className="text-white/25 text-[9px] tracking-[0.4em] font-[system-ui]">SCROLL</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ─── STORY ─── */}
      <section
        id="story"
        className="min-h-screen flex items-center justify-center px-6 py-24"
        style={{ background: "#080608" }}
      >
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: easeOut }}
            className="rounded-3xl overflow-hidden aspect-[3/4] relative"
            style={{ boxShadow: "0 24px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1619994403073-2cec9c04fdb8?q=80&w=1200"
              alt="Our story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/[0.07] pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: easeOut, delay: 0.12 }}
            className={`${liquidGlass} rounded-3xl p-10 md:p-14`}
          >
            <span className="text-[10px] tracking-[0.6em] text-white/35 font-[system-ui] uppercase block mb-6">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-5">
              Crafted<br /><em className="italic">Identity</em>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10 font-[system-ui]">
              Designed for those who command presence. Each fragrance captures
              emotion, depth, and individuality in every drop — a signature
              scent built not just to be worn, but to be remembered.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]">
              {[{ n: "01", l: "Refined" }, { n: "02", l: "Layered" }, { n: "03", l: "Unique" }].map(({ n, l }) => (
                <div key={n}>
                  <p className="text-2xl font-light text-white/25 mb-1">{n}</p>
                  <p className="text-[11px] tracking-[0.2em] text-white/55 font-[system-ui] uppercase">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT SECTION ─── */}
      <section
        id="fragrance"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 relative overflow-hidden transition-all duration-1000"
        style={{ background: current.bgGrad }}
      >
        {/* soft ambient orb */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "_orb"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 50% at 25% 50%, ${current.accent}12 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* noise grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* ← arrow */}
        <AnimatePresence>
          {index > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={spring}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => go(-1)}
              className={`absolute left-3 md:left-8 z-10 w-11 h-11 rounded-full ${liquidGlass} flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200`}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* → arrow */}
        <AnimatePresence>
          {index < products.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={spring}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => go(1)}
              className={`absolute right-3 md:right-8 z-10 w-11 h-11 rounded-full ${liquidGlass} flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200`}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
              animate={{ width: i === index ? 28 : 6, opacity: i === index ? 0.75 : 0.3 }}
              transition={spring}
              className="h-1.5 rounded-full bg-white"
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>

        {/* keyboard hint */}
        <div className="absolute bottom-8 right-6 hidden md:flex items-center gap-1.5 opacity-25">
          {["←", "→"].map((k) => (
            <span key={k} className={`${liquidGlass} text-[10px] px-2 py-1 rounded font-[system-ui]`}>{k}</span>
          ))}
          <span className="text-[10px] font-[system-ui] text-white/50 ml-1">navigate</span>
        </div>

        {/* ── PRODUCT CARD ── */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: easeOut }}
            className="max-w-5xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden relative"
            style={{
              boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* LEFT — Image with tilt */}
            <div
              className="relative aspect-square md:aspect-auto min-h-[320px] overflow-hidden"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <TiltImage src={current.image} alt={current.name} accent={current.accent} />
            </div>

            {/* RIGHT — Info */}
            <div
              className="flex flex-col justify-center p-8 sm:p-10 md:p-14 relative"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.15) 100%)",
                backdropFilter: "blur(36px) saturate(110%)",
                WebkitBackdropFilter: "blur(36px) saturate(110%)",
              }}
            >
              {/* accent line */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 hidden md:block"
                style={{ background: `${current.accent}40` }}
              />

              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ...spring }}
                className="text-[10px] tracking-[0.55em] font-[system-ui] uppercase mb-4 block"
                style={{ color: current.accent }}
              >
                {current.mood}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...spring }}
                className="text-4xl sm:text-5xl font-light leading-none mb-1"
              >
                {current.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/35 text-base italic mb-6"
              >
                {current.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...spring }}
                className="text-white/55 text-sm leading-relaxed font-[system-ui] mb-8"
              >
                {current.description}
              </motion.p>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-2 mb-9"
              >
                {current.notes.map((n, i) => (
                  <motion.span
                    key={n}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05, ...springSnappy }}
                    className="text-[11px] px-3 py-1.5 rounded-full font-[system-ui] tracking-wider"
                    style={{
                      background: `${current.accent}16`,
                      border: `1px solid ${current.accent}32`,
                      color: current.accent,
                    }}
                  >
                    {n}
                  </motion.span>
                ))}
              </motion.div>

              {/* Price + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...spring }}
                className="flex items-center gap-5"
              >
                <span className="text-3xl font-light">{current.price}</span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openModal}
                  className="px-8 py-3 rounded-full text-[12px] font-[system-ui] tracking-[0.18em] transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${current.accent}28, ${current.accent}10)`,
                    border: `1px solid ${current.accent}50`,
                    color: current.accent,
                    boxShadow: `0 4px 20px ${current.accent}20`,
                  }}
                >
                  BUY NOW
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── MODAL — Buy Now (sheet-to-expand) ─── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "60%", opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className={`${liquidGlassHeavy} rounded-t-[28px] sm:rounded-[28px] w-full sm:w-auto sm:min-w-[440px] sm:max-w-[480px] p-8 sm:p-10 relative overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* accent glow behind */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `${current.accent}10`, filter: "blur(40px)" }}
              />

              {/* drag handle (mobile) */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-7 sm:hidden" />

              {/* close */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.1] flex items-center justify-center text-white/45 hover:text-white transition-all text-sm"
              >
                ✕
              </motion.button>

              <span
                className="text-[9px] tracking-[0.55em] font-[system-ui] uppercase mb-1 block"
                style={{ color: current.accent }}
              >
                Add to Cart
              </span>
              <h3 className="text-[28px] font-light mb-1">{current.name}</h3>
              <p className="text-white/35 text-sm italic mb-8">{current.tagline}</p>

              {/* Size selector */}
              <p className="text-[10px] tracking-[0.35em] text-white/35 font-[system-ui] uppercase mb-3">
                Select Size
              </p>
              <div className="flex gap-3 mb-8">
                {current.sizes.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedSize(s)}
                      className="flex-1 py-3 rounded-xl text-sm font-[system-ui] relative overflow-hidden transition-all duration-300"
                      style={
                        active
                          ? {
                              background: `${current.accent}22`,
                              border: `1px solid ${current.accent}60`,
                              color: current.accent,
                              boxShadow: `inset 0 1px 0 ${current.accent}20`,
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.45)",
                            }
                      }
                    >
                      {active && (
                        <motion.div
                          layoutId="sizeActive"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: `${current.accent}12` }}
                          transition={spring}
                        />
                      )}
                      <span className="relative">{s}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-baseline justify-between mb-6">
                <span className="text-[26px] font-light">{current.price}</span>
                <AnimatePresence>
                  {!selectedSize && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-white/25 font-[system-ui]"
                    >
                      select a size
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA button — morphs to success */}
              <AnimatePresence mode="wait">
                {modal === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.93, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={spring}
                    className="w-full py-4 rounded-2xl text-[12px] font-[system-ui] tracking-[0.2em] text-center"
                    style={{
                      background: `${current.accent}20`,
                      border: `1px solid ${current.accent}50`,
                      color: current.accent,
                    }}
                  >
                    ✓ ADDED TO CART
                  </motion.div>
                ) : (
                  <motion.button
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={selectedSize ? { scale: 1.02, y: -1 } : {}}
                    whileTap={selectedSize ? { scale: 0.97 } : {}}
                    onClick={handleAdd}
                    disabled={!selectedSize}
                    transition={spring}
                    className="w-full py-4 rounded-2xl text-[12px] font-[system-ui] tracking-[0.2em] transition-all duration-400"
                    style={
                      selectedSize
                        ? {
                            background: `linear-gradient(135deg, ${current.accent}35, ${current.accent}18)`,
                            border: `1px solid ${current.accent}55`,
                            color: current.accent,
                            boxShadow: `0 6px 30px ${current.accent}20`,
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.18)",
                            cursor: "not-allowed",
                          }
                    }
                  >
                    ADD TO CART
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FOOTER ─── */}
      <section
        id="contact"
        className="min-h-[45vh] flex items-center justify-center px-6 py-20 relative"
        style={{ background: "#060406" }}
      >
        <div className="max-w-4xl w-full grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <p className="tracking-[0.5em] text-[10px] text-white/25 font-[system-ui] mb-3">LUXE</p>
            <h2 className="text-4xl font-light mb-4">
              Crafted for<br /><em className="italic">Memory</em>
            </h2>
            <p className="text-white/35 text-sm font-[system-ui] leading-relaxed">
              Fragrances that leave a mark.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-8 items-start">
            {[
              { label: "Collection", links: ["Noir Essence", "Velvet Bloom", "Azure Mist"] },
              { label: "Company", links: ["Our Story", "Craft", "Contact"] },
            ].map(({ label, links }) => (
              <div key={label}>
                <p className="text-[10px] tracking-[0.45em] text-white/25 font-[system-ui] uppercase mb-4">
                  {label}
                </p>
                <ul className="space-y-3">
                  {links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-white/45 hover:text-white/90 transition-colors duration-300 font-[system-ui]"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/15 text-[10px] font-[system-ui] tracking-widest whitespace-nowrap">
          © 2026 LUXE — ALL RIGHTS RESERVED
        </p>
      </section>
    </div>
  );
}